import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import math
import random
import time
import threading
import json
import os
from datetime import datetime

class LuckWheelApp:
    def __init__(self, root):
        self.root = root
        self.root.title("🎯 Luck Wheel - Python Edition")
        self.root.geometry("1000x700")
        self.root.configure(bg='#1a1a2e')
        
        # App state
        self.options = ["Option 1", "Option 2", "Option 3"]
        self.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
            '#A3E4D7', '#FAD7A0', '#D5A6BD', '#AED6F1', '#A9DFBF'
        ]
        self.current_rotation = 0
        self.is_spinning = False
        self.wheel_radius = 150
        self.center_x = 200
        self.center_y = 200
        self.spin_history = []
        self.spin_sounds = True
        self.auto_save = True
        
        self.setup_ui()
        self.setup_menu()
        self.load_data()
        self.draw_wheel()
        
    def setup_ui(self):
        # Main title
        title_frame = tk.Frame(self.root, bg='#1a1a2e')
        title_frame.pack(pady=20)
        
        title_label = tk.Label(
            title_frame, 
            text="🎯 Luck Wheel", 
            font=('Arial', 28, 'bold'),
            fg='#ffd700',
            bg='#1a1a2e'
        )
        title_label.pack()
        
        subtitle_label = tk.Label(
            title_frame,
            text="Spin the wheel and let fate decide!",
            font=('Arial', 14),
            fg='#87ceeb',
            bg='#1a1a2e'
        )
        subtitle_label.pack()
        
        # Main content frame
        main_frame = tk.Frame(self.root, bg='#1a1a2e')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Left side - Wheel
        self.wheel_frame = tk.Frame(main_frame, bg='#2d2d44', relief=tk.RAISED, bd=2)
        self.wheel_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))
        
        wheel_title = tk.Label(
            self.wheel_frame,
            text="🎰 Wheel of Fortune",
            font=('Arial', 16, 'bold'),
            fg='#ffd700',
            bg='#2d2d44'
        )
        wheel_title.pack(pady=10)
        
        # Canvas for wheel
        self.canvas = tk.Canvas(
            self.wheel_frame,
            width=400,
            height=400,
            bg='#2d2d44',
            highlightthickness=0
        )
        self.canvas.pack(pady=20)
        
        # Control buttons
        button_frame = tk.Frame(self.wheel_frame, bg='#2d2d44')
        button_frame.pack(pady=20)
        
        self.spin_button = tk.Button(
            button_frame,
            text="🎲 SPIN WHEEL",
            command=self.spin_wheel,
            font=('Arial', 14, 'bold'),
            bg='#28a745',
            fg='white',
            relief=tk.RAISED,
            bd=3,
            padx=20,
            pady=10,
            cursor='hand2'
        )
        self.spin_button.pack(side=tk.LEFT, padx=10)
        
        self.reset_button = tk.Button(
            button_frame,
            text="🔄 RESET",
            command=self.reset_wheel,
            font=('Arial', 14, 'bold'),
            bg='#dc3545',
            fg='white',
            relief=tk.RAISED,
            bd=5,
            padx=20,
            pady=10,
            cursor='hand2'
        )
        self.reset_button.pack(side=tk.LEFT, padx=10)
        
        # Result display
        self.result_frame = tk.Frame(self.wheel_frame, bg='#2d2d44')
        self.result_frame.pack(pady=20)
        
        self.result_label = tk.Label(
            self.result_frame,
            text="",
            font=('Arial', 18, 'bold'),
            fg='#ffd700',
            bg='#2d2d44',
            wraplength=350
        )
        self.result_label.pack()
        
        # Right side - Options
        options_frame = tk.Frame(main_frame, bg='#2d2d44', relief=tk.RAISED, bd=2)
        options_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(10, 0))
        
        options_title = tk.Label(
            options_frame,
            text="⚙️ Wheel Options",
            font=('Arial', 16, 'bold'),
            fg='#ffd700',
            bg='#2d2d44'
        )
        options_title.pack(pady=10)
        
        # Add option section
        add_frame = tk.Frame(options_frame, bg='#2d2d44')
        add_frame.pack(fill=tk.X, padx=20, pady=10)
        
        tk.Label(
            add_frame,
            text="Add New Option:",
            font=('Arial', 12, 'bold'),
            fg='#87ceeb',
            bg='#2d2d44'
        ).pack(anchor=tk.W)
        
        entry_frame = tk.Frame(add_frame, bg='#2d2d44')
        entry_frame.pack(fill=tk.X, pady=5)
        
        self.option_entry = tk.Entry(
            entry_frame,
            font=('Arial', 12),
            bg='#404040',
            fg='white',
            insertbackground='white',
            relief=tk.FLAT,
            bd=5
        )
        self.option_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        self.option_entry.bind('<Return>', lambda e: self.add_option())
        
        add_btn = tk.Button(
            entry_frame,
            text="➕ Add",
            command=self.add_option,
            font=('Arial', 10, 'bold'),
            bg='#007bff',
            fg='white',
            relief=tk.RAISED,
            bd=2,
            cursor='hand2'
        )
        add_btn.pack(side=tk.RIGHT)
        
        # Stats
        self.stats_label = tk.Label(
            add_frame,
            text="",
            font=('Arial', 10),
            fg='#87ceeb',
            bg='#2d2d44'
        )
        self.stats_label.pack(anchor=tk.W, pady=5)
        
        # Options list
        list_frame = tk.Frame(options_frame, bg='#2d2d44')
        list_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        tk.Label(
            list_frame,
            text="Current Options:",
            font=('Arial', 12, 'bold'),
            fg='#87ceeb',
            bg='#2d2d44'
        ).pack(anchor=tk.W)
        
        # Scrollable listbox
        listbox_frame = tk.Frame(list_frame, bg='#2d2d44')
        listbox_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        scrollbar = tk.Scrollbar(listbox_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.options_listbox = tk.Listbox(
            listbox_frame,
            font=('Arial', 11),
            bg='#404040',
            fg='white',
            selectbackground='#007bff',
            relief=tk.FLAT,
            bd=5,
            yscrollcommand=scrollbar.set
        )
        self.options_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.options_listbox.yview)
        
        # Remove button
        remove_btn = tk.Button(
            list_frame,
            text="🗑️ Remove Selected",
            command=self.remove_option,
            font=('Arial', 10, 'bold'),
            bg='#dc3545',
            fg='white',
            relief=tk.RAISED,
            bd=2,
            cursor='hand2'
        )
        remove_btn.pack(pady=5)
        
    def setup_menu(self):
        """Setup application menu bar"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="New Wheel", command=self.new_wheel, accelerator="Ctrl+N")
        file_menu.add_separator()
        file_menu.add_command(label="Save Wheel", command=self.save_wheel, accelerator="Ctrl+S")
        file_menu.add_command(label="Load Wheel", command=self.load_wheel, accelerator="Ctrl+O")
        file_menu.add_separator()
        file_menu.add_command(label="Export History", command=self.export_history)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.root.quit, accelerator="Ctrl+Q")
        
        # Tools menu
        tools_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Tools", menu=tools_menu)
        tools_menu.add_command(label="Clear History", command=self.clear_history)
        tools_menu.add_command(label="Quick Fill", command=self.quick_fill)
        tools_menu.add_command(label="Random Colors", command=self.randomize_colors)
        
        # View menu
        view_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="View", menu=view_menu)
        view_menu.add_command(label="Statistics", command=self.show_statistics)
        view_menu.add_command(label="History", command=self.show_history)
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Help", menu=help_menu)
        help_menu.add_command(label="About", command=self.show_about)
        help_menu.add_command(label="Instructions", command=self.show_instructions)
        
        # Keyboard shortcuts
        self.root.bind('<Control-n>', lambda e: self.new_wheel())
        self.root.bind('<Control-s>', lambda e: self.save_wheel())
        self.root.bind('<Control-o>', lambda e: self.load_wheel())
        self.root.bind('<Control-q>', lambda e: self.root.quit())
        self.root.bind('<F1>', lambda e: self.show_instructions())
    
        
    def draw_wheel(self):
        """Draw the wheel with current options"""
        self.canvas.delete("all")
        
        if not self.options:
            self.canvas.create_text(
                self.center_x, self.center_y,
                text="Add options to start!",
                font=('Arial', 16),
                fill='white'
            )
            return
        
        num_options = len(self.options)
        angle_per_option = 360 / num_options
        
        # Draw wheel segments
        for i, option in enumerate(self.options):
            start_angle = i * angle_per_option + self.current_rotation
            end_angle = (i + 1) * angle_per_option + self.current_rotation
            color = self.colors[i % len(self.colors)]
            
            # Create arc
            self.canvas.create_arc(
                self.center_x - self.wheel_radius,
                self.center_y - self.wheel_radius,
                self.center_x + self.wheel_radius,
                self.center_y + self.wheel_radius,
                start=start_angle,
                extent=angle_per_option,
                fill=color,
                outline='white',
                width=2
            )
            
            # Add text
            text_angle = math.radians(start_angle + angle_per_option / 2)
            text_radius = self.wheel_radius * 0.7
            text_x = self.center_x + text_radius * math.cos(text_angle)
            text_y = self.center_y + text_radius * math.sin(text_angle)
            
            # Truncate long text
            display_text = option[:12] + "..." if len(option) > 12 else option
            
            self.canvas.create_text(
                text_x, text_y,
                text=display_text,
                font=('Arial', 10, 'bold'),
                fill='white',
                angle=math.degrees(text_angle) if abs(math.degrees(text_angle)) < 90 else math.degrees(text_angle) + 180
            )
        
        # Draw center circle
        center_size = 20
        self.canvas.create_oval(
            self.center_x - center_size,
            self.center_y - center_size,
            self.center_x + center_size,
            self.center_y + center_size,
            fill='#ffd700',
            outline='white',
            width=3
        )
        
        # Draw pointer (arrow pointing right)
        pointer_size = 30
        self.canvas.create_polygon(
            self.center_x + self.wheel_radius + 10,
            self.center_y,
            self.center_x + self.wheel_radius + 10 + pointer_size,
            self.center_y - 15,
            self.center_x + self.wheel_radius + 10 + pointer_size,
            self.center_y + 15,
            fill='#ffd700',
            outline='white',
            width=2
        )
    
    def add_option(self):
        """Add a new option to the wheel"""
        new_option = self.option_entry.get().strip()
        if new_option and len(self.options) < 50:
            if new_option not in self.options:
                self.options.append(new_option)
                self.option_entry.delete(0, tk.END)
                self.update_options_display()
                self.draw_wheel()
            else:
                messagebox.showwarning("Duplicate Option", "This option already exists!")
        elif len(self.options) >= 50:
            messagebox.showwarning("Limit Reached", "Maximum 50 options allowed!")
        elif not new_option:
            messagebox.showwarning("Empty Option", "Please enter a valid option!")
    
    def remove_option(self):
        """Remove selected option from the wheel"""
        selection = self.options_listbox.curselection()
        if selection and len(self.options) > 2:
            index = selection[0]
            self.options.pop(index)
            self.update_options_display()
            self.draw_wheel()
        elif len(self.options) <= 2:
            messagebox.showwarning("Minimum Options", "At least 2 options required!")
        else:
            messagebox.showwarning("No Selection", "Please select an option to remove!")
    
    def update_options_display(self):
        """Update the options listbox and stats"""
        self.options_listbox.delete(0, tk.END)
        for i, option in enumerate(self.options):
            color_indicator = "●"
            display_text = f"{color_indicator} {option}"
            self.options_listbox.insert(tk.END, display_text)
            # Color coding would require more complex listbox styling
        
        # Update stats
        if self.options:
            probability = 100 / len(self.options)
            stats_text = f"{len(self.options)}/50 options • Each has {probability:.1f}% chance"
        else:
            stats_text = "0/50 options • Add options to get started"
        
        self.stats_label.config(text=stats_text)
    
    def spin_wheel(self):
        """Spin the wheel with animation"""
        if self.is_spinning or not self.options:
            return
        
        self.is_spinning = True
        self.spin_button.config(state=tk.DISABLED, text="🎲 SPINNING...")
        self.result_label.config(text="🎰 Spinning...")
        
        # Run animation in separate thread
        threading.Thread(target=self.animate_spin, daemon=True).start()
    
    def animate_spin(self):
        """Animate the wheel spinning"""
        # Random spin parameters
        total_rotation = random.randint(1800, 3600)  # 5-10 full rotations
        steps = 60
        step_rotation = total_rotation / steps
        
        # Spin animation
        for i in range(steps):
            self.current_rotation += step_rotation
            # Slow down towards the end
            if i > steps * 0.7:
                time.sleep(0.05 + (i - steps * 0.7) * 0.003)
            else:
                time.sleep(0.02)
            
            # Update wheel on main thread
            self.root.after(0, self.draw_wheel)
        
        # Determine winner
        self.root.after(0, self.determine_winner)
    
    def determine_winner(self):
        """Determine and display the winner"""
        if not self.options:
            return
        
        # Normalize rotation to 0-360 degrees
        normalized_rotation = self.current_rotation % 360
        
        # Calculate which segment the pointer is pointing to
        angle_per_option = 360 / len(self.options)
        # Pointer points to the right, so we need to adjust
        pointer_angle = (360 - normalized_rotation) % 360
        winner_index = int(pointer_angle / angle_per_option) % len(self.options)
        
        winner = self.options[winner_index]
        
        # Display result
        self.result_label.config(
            text=f"🎉 WINNER: {winner} 🎉",
            fg='#00ff00'
        )
        
        # Re-enable spin button
        self.spin_button.config(state=tk.NORMAL, text="🎲 SPIN WHEEL")
        self.is_spinning = False
        
        # Show winner popup
        messagebox.showinfo("🎉 Winner!", f"The winner is:\n\n{winner}")
        
        # Add to history
        self.spin_history.append({
            'winner': winner,
            'timestamp': datetime.now().strftime("%H:%M:%S"),
            'total_options': len(self.options)
        })
        
        # Keep only last 20 results
        if len(self.spin_history) > 20:
            self.spin_history = self.spin_history[-20:]
        
        self.update_history_display()
        
        # Auto-save if enabled
        if self.auto_save:
            self.save_data()
    
    def reset_wheel(self):
        """Reset the wheel to initial position"""
        if self.is_spinning:
            return
        
        self.current_rotation = 0
        self.result_label.config(text="", fg='#ffd700')
        self.draw_wheel()
    
    def update_history_display(self):
        """Update the history display"""
        self.history_text.config(state=tk.NORMAL)
        self.history_text.delete(1.0, tk.END)
        
        if not self.spin_history:
            self.history_text.insert(tk.END, "No spins yet. Start spinning to see results!")
        else:
            for i, result in enumerate(reversed(self.spin_history[-10:])):  # Show last 10
                entry = f"{result['timestamp']} - {result['winner']}\n"
                self.history_text.insert(tk.END, entry)
        
        self.history_text.config(state=tk.DISABLED)
    
    # File operations
    def save_data(self):
        """Auto-save current state"""
        try:
            data = {
                'options': self.options,
                'history': self.spin_history,
                'settings': {
                    'auto_save': self.auto_save,
                    'spin_sounds': self.spin_sounds
                }
            }
            with open('wheel_data.json', 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            pass  # Silent fail for auto-save
    
    def load_data(self):
        """Load saved data"""
        try:
            if os.path.exists('wheel_data.json'):
                with open('wheel_data.json', 'r') as f:
                    data = json.load(f)
                
                self.options = data.get('options', ["Option 1", "Option 2", "Option 3"])
                self.spin_history = data.get('history', [])
                settings = data.get('settings', {})
                self.auto_save = settings.get('auto_save', True)
                self.spin_sounds = settings.get('spin_sounds', True)
                
                self.update_options_display()
                self.update_history_display()
        except Exception as e:
            pass  # Silent fail for loading
    
    def new_wheel(self):
        """Create a new wheel"""
        if messagebox.askyesno("New Wheel", "Are you sure? This will clear all options and history."):
            self.options = ["Option 1", "Option 2", "Option 3"]
            self.spin_history = []
            self.current_rotation = 0
            self.result_label.config(text="", fg='#ffd700')
            self.update_options_display()
            self.update_history_display()
            self.draw_wheel()
    
    def save_wheel(self):
        """Save wheel to file"""
        filename = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
            title="Save Wheel"
        )
        if filename:
            try:
                data = {
                    'options': self.options,
                    'history': self.spin_history,
                    'created': datetime.now().isoformat(),
                    'version': '2.0'
                }
                with open(filename, 'w') as f:
                    json.dump(data, f, indent=2)
                messagebox.showinfo("Success", "Wheel saved successfully!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save wheel:\n{str(e)}")
    
    def load_wheel(self):
        """Load wheel from file"""
        filename = filedialog.askopenfilename(
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
            title="Load Wheel"
        )
        if filename:
            try:
                with open(filename, 'r') as f:
                    data = json.load(f)
                
                self.options = data.get('options', [])
                self.spin_history = data.get('history', [])
                
                if not self.options:
                    self.options = ["Option 1", "Option 2", "Option 3"]
                
                self.current_rotation = 0
                self.result_label.config(text="", fg='#ffd700')
                self.update_options_display()
                self.update_history_display()
                self.draw_wheel()
                messagebox.showinfo("Success", "Wheel loaded successfully!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load wheel:\n{str(e)}")
    
    def export_history(self):
        """Export spin history to text file"""
        if not self.spin_history:
            messagebox.showwarning("No History", "No spin history to export!")
            return
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
            title="Export History"
        )
        if filename:
            try:
                with open(filename, 'w') as f:
                    f.write("Luck Wheel - Spin History\n")
                    f.write("=" * 30 + "\n\n")
                    for result in self.spin_history:
                        f.write(f"{result['timestamp']} - {result['winner']} "
                               f"(from {result['total_options']} options)\n")
                messagebox.showinfo("Success", "History exported successfully!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to export history:\n{str(e)}")
    
    def clear_history(self):
        """Clear spin history"""
        if messagebox.askyesno("Clear History", "Are you sure you want to clear all spin history?"):
            self.spin_history = []
            self.update_history_display()
            messagebox.showinfo("Success", "History cleared!")
    
    def quick_fill(self):
        """Quick fill with sample options"""
        samples = [
            "Pizza", "Burger", "Sushi", "Tacos", "Pasta", "Salad",
            "Red", "Blue", "Green", "Yellow", "Purple", "Orange",
            "Movie", "Game", "Book", "Music", "Sport", "Art",
            "Coffee", "Tea", "Juice", "Water", "Soda", "Smoothie"
        ]
        
        if messagebox.askyesno("Quick Fill", "Replace current options with random samples?"):
            num_options = random.randint(6, 12)
            self.options = random.sample(samples, num_options)
            self.update_options_display()
            self.draw_wheel()
            messagebox.showinfo("Success", f"Added {num_options} random options!")
    
    def randomize_colors(self):
        """Randomize wheel colors"""
        random.shuffle(self.colors)
        self.draw_wheel()
        messagebox.showinfo("Success", "Colors randomized!")
    
    def show_statistics(self):
        """Show spin statistics"""
        if not self.spin_history:
            messagebox.showinfo("Statistics", "No spin history available!")
            return
        
        # Count wins for each option
        win_counts = {}
        for result in self.spin_history:
            winner = result['winner']
            win_counts[winner] = win_counts.get(winner, 0) + 1
        
        # Create statistics window
        stats_window = tk.Toplevel(self.root)
        stats_window.title("📊 Spin Statistics")
        stats_window.geometry("400x500")
        stats_window.configure(bg='#2d2d44')
        
        tk.Label(
            stats_window,
            text="📊 Spin Statistics",
            font=('Arial', 16, 'bold'),
            fg='#ffd700',
            bg='#2d2d44'
        ).pack(pady=10)
        
        # Summary
        summary_frame = tk.Frame(stats_window, bg='#2d2d44')
        summary_frame.pack(fill=tk.X, padx=20, pady=10)
        
        tk.Label(
            summary_frame,
            text=f"Total Spins: {len(self.spin_history)}",
            font=('Arial', 12),
            fg='white',
            bg='#2d2d44'
        ).pack(anchor=tk.W)
        
        tk.Label(
            summary_frame,
            text=f"Unique Winners: {len(win_counts)}",
            font=('Arial', 12),
            fg='white',
            bg='#2d2d44'
        ).pack(anchor=tk.W)
        
        # Win counts
        text_widget = tk.Text(
            stats_window,
            font=('Arial', 11),
            bg='#404040',
            fg='white',
            relief=tk.FLAT,
            bd=5
        )
        text_widget.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        # Sort by win count
        sorted_wins = sorted(win_counts.items(), key=lambda x: x[1], reverse=True)
        
        text_widget.insert(tk.END, "Win Counts:\n" + "=" * 20 + "\n\n")
        for option, count in sorted_wins:
            percentage = (count / len(self.spin_history)) * 100
            text_widget.insert(tk.END, f"{option}: {count} wins ({percentage:.1f}%)\n")
        
        text_widget.config(state=tk.DISABLED)
    
    def show_history(self):
        """Show complete spin history"""
        if not self.spin_history:
            messagebox.showinfo("History", "No spin history available!")
            return
        
        # Create history window
        history_window = tk.Toplevel(self.root)
        history_window.title("📜 Complete History")
        history_window.geometry("500x600")
        history_window.configure(bg='#2d2d44')
        
        tk.Label(
            history_window,
            text="📜 Complete Spin History",
            font=('Arial', 16, 'bold'),
            fg='#ffd700',
            bg='#2d2d44'
        ).pack(pady=10)
        
        # History list
        frame = tk.Frame(history_window, bg='#2d2d44')
        frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        scrollbar = tk.Scrollbar(frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        text_widget = tk.Text(
            frame,
            font=('Arial', 10),
            bg='#404040',
            fg='white',
            relief=tk.FLAT,
            bd=5,
            yscrollcommand=scrollbar.set
        )
        text_widget.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=text_widget.yview)
        
        # Add history entries
        for i, result in enumerate(reversed(self.spin_history)):
            entry = f"{i+1:2d}. {result['timestamp']} - {result['winner']} (from {result['total_options']} options)\n"
            text_widget.insert(tk.END, entry)
        
        text_widget.config(state=tk.DISABLED)
    
    def show_about(self):
        """Show about dialog"""
        about_text = """🎯 Luck Wheel v2.0

A fun and interactive wheel spinning application!

Features:
• Add up to 50 custom options
• Equal probability for all options
• Smooth spinning animation
• Spin history tracking
• Statistics and analysis
• Save/Load wheel configurations
• Quick fill with sample data

Created with Python & tkinter
© 2024 Luck Wheel App"""
        
        messagebox.showinfo("About Luck Wheel", about_text)
    
    def show_instructions(self):
        """Show instructions dialog"""
        instructions = """🎯 How to Use Luck Wheel

Basic Usage:
1. Add options using the text field
2. Click 'SPIN WHEEL' to start spinning
3. Watch the wheel spin and see the result!

Advanced Features:
• Save/Load: Use File menu to save your wheels
• Quick Fill: Generate random sample options
• Statistics: View win counts and percentages
• History: See all previous spin results
• Export: Save your spin history to a file

Keyboard Shortcuts:
• Ctrl+N: New wheel
• Ctrl+S: Save wheel
• Ctrl+O: Load wheel
• Ctrl+Q: Exit
• F1: Show instructions

Tips:
• You can have 2-50 options on your wheel
• Each option has exactly equal probability
• The app auto-saves your progress
• Use Quick Actions for faster setup"""
        
        messagebox.showinfo("Instructions", instructions)

def main():
    root = tk.Tk()
    app = LuckWheelApp(root)
    
    # Center window on screen
    root.update_idletasks()
    x = (root.winfo_screenwidth() // 2) - (root.winfo_width() // 2)
    y = (root.winfo_screenheight() // 2) - (root.winfo_height() // 2)
    root.geometry(f"+{x}+{y}")
    
    root.mainloop()

if __name__ == "__main__":
    main()