/* ===========================================================
   Lucky Wheel
   Author : Seif Basha
   Version: 2.0
=========================================================== */

/* ===========================================================
   Google Font
=========================================================== */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');


/* ===========================================================
   CSS Variables
=========================================================== */

:root{

    --background:#0f172a;
    --background-secondary:#1e293b;

    --card:#1e293bcc;

    --border:rgba(255,255,255,.08);

    --primary:#3b82f6;
    --primary-hover:#2563eb;

    --success:#22c55e;
    --danger:#ef4444;
    --warning:#f59e0b;

    --text:#f8fafc;
    --text-secondary:#cbd5e1;
    --text-muted:#94a3b8;

    --input-bg:#111827;

    --shadow:
        0 12px 30px rgba(0,0,0,.35);

    --radius:18px;

    --transition:.25s ease;

}


/* ===========================================================
   Themes
=========================================================== */

body[data-theme="light"]{

    --background:#eef2f7;
    --background-secondary:#dde6f0;

    --card:#ffffffcc;

    --border:rgba(15,23,42,.08);

    --primary:#2563eb;
    --primary-hover:#1d4ed8;

    --text:#0f172a;
    --text-secondary:#334155;
    --text-muted:#64748b;

    --input-bg:#f1f5f9;

    --shadow:
        0 12px 30px rgba(15,23,42,.12);

}

body[data-theme="ocean"]{

    --background:#04202c;
    --background-secondary:#0a3d4d;

    --card:#0e3b4ecc;

    --border:rgba(255,255,255,.08);

    --primary:#06b6d4;
    --primary-hover:#0891b2;

    --success:#2dd4bf;

    --text:#e6fbff;
    --text-secondary:#a5e6f0;
    --text-muted:#7cc4d1;

    --input-bg:#0a2f3b;

    --shadow:
        0 12px 30px rgba(0,0,0,.4);

}

body[data-theme="forest"]{

    --background:#0f1f14;
    --background-secondary:#1a3324;

    --card:#1c3627cc;

    --border:rgba(255,255,255,.08);

    --primary:#22c55e;
    --primary-hover:#16a34a;

    --warning:#eab308;

    --text:#f0fdf4;
    --text-secondary:#bbf7d0;
    --text-muted:#86e0a4;

    --input-bg:#12261a;

    --shadow:
        0 12px 30px rgba(0,0,0,.4);

}


/* ===========================================================
   Reset
=========================================================== */

*{

    margin:0;

    padding:0;

    box-sizing:border-box;

}

html{

    scroll-behavior:smooth;

}

body{

    min-height:100vh;

    background:
        linear-gradient(
            135deg,
            var(--background),
            var(--background-secondary)
        );

    color:var(--text);

    font-family:"Inter",sans-serif;

    transition:background .3s ease,color .3s ease;

}


/* ===========================================================
   Typography
=========================================================== */

h1{

    font-size:2.7rem;

    font-weight:800;

}

h2{

    font-size:1.2rem;

    margin-bottom:18px;

}

h3{

    font-size:1rem;

}

p{

    color:var(--text-secondary);

    line-height:1.7;

}

a{

    color:var(--primary);

    text-decoration:none;

}

a:hover{

    text-decoration:underline;

}


/* ===========================================================
   Header
=========================================================== */

.header{

    width:95%;

    max-width:1700px;

    margin:auto;

    padding:45px 0 20px;

    text-align:center;

}

.header h1{

    margin-bottom:12px;

}

.header p{

    font-size:1.05rem;

}


/* ===========================================================
   Dashboard
=========================================================== */

.dashboard{

    width:95%;

    max-width:1700px;

    margin:auto;

    display:grid;

    grid-template-columns:

        360px

        1fr

        330px;

    gap:30px;

    padding-bottom:40px;

}


/* ===========================================================
   Sidebar
=========================================================== */

.sidebar{

    display:flex;

    flex-direction:column;

    gap:22px;

}

.right-panel{

    display:flex;

    flex-direction:column;

    gap:22px;

}


/* ===========================================================
   Cards
=========================================================== */

.card{

    background:var(--card);

    backdrop-filter:blur(18px);

    border:1px solid var(--border);

    border-radius:var(--radius);

    padding:24px;

    box-shadow:var(--shadow);

    transition:var(--transition);

}

.card:hover{

    transform:translateY(-4px);

    border-color:

        rgba(59,130,246,.35);

}


/* ===========================================================
   Wheel Area
=========================================================== */

.wheel-section{

    display:flex;

    justify-content:center;

    align-items:center;

}

.wheel-card{

    position:relative;

    width:100%;

    height:100%;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    background:var(--card);

    border-radius:25px;

    backdrop-filter:blur(18px);

    border:1px solid var(--border);

    box-shadow:var(--shadow);

    padding:35px;

}


/* ===========================================================
   Inputs
=========================================================== */

textarea,
input,
select{

    width:100%;

    padding:14px 16px;

    margin-top:10px;

    margin-bottom:18px;

    border-radius:12px;

    border:1px solid transparent;

    background:var(--input-bg);

    color:var(--text);

    font-size:15px;

    outline:none;

    transition:var(--transition);

}


textarea{

    resize:vertical;

    min-height:220px;

}


textarea:focus,
input:focus,
select:focus{

    border-color:var(--primary);

}


/* ===========================================================
   Labels
=========================================================== */

label{

    display:block;

    font-weight:600;

    margin-top:8px;

}


/* ===========================================================
   Buttons
=========================================================== */

button{

    border:none;

    cursor:pointer;

    border-radius:12px;

    padding:14px;

    font-size:15px;

    font-weight:600;

    transition:var(--transition);

}


button:hover{

    transform:translateY(-2px);

}


button:active{

    transform:scale(.97);

}

button:disabled{

    opacity:.5;

    cursor:not-allowed;

    transform:none;

}


/* ===========================================================
   Primary Button
=========================================================== */

.primary{

    background:var(--primary);

    color:white;

}


.primary:hover{

    background:var(--primary-hover);

}


/* ===========================================================
   Normal Buttons
=========================================================== */

button:not(.primary){

    background:#334155;

    color:white;

}


button:not(.primary):hover{

    background:#475569;

}


/* ===========================================================
   Button Grid
=========================================================== */

.button-grid{

    display:grid;

    grid-template-columns:

        repeat(2,1fr);

    gap:12px;

    margin-top:10px;

}


.button-column{

    display:flex;

    flex-direction:column;

    gap:14px;

}


/* ===========================================================
   Winner Card
=========================================================== */

.winner-card{

    text-align:center;

}


#winner{

    margin-top:15px;

    font-size:2.6rem;

    color:var(--success);

    font-weight:800;

    word-break:break-word;

}


/* ===========================================================
   Statistics
=========================================================== */

.stat{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:15px 0;

    border-bottom:

        1px solid rgba(255,255,255,.08);

}


.stat:last-child{

    border-bottom:none;

}


.stat strong{

    color:var(--primary);

    font-size:1.1rem;

}


/* ===========================================================
   History
=========================================================== */

#historyList{

    list-style:none;

    display:flex;

    flex-direction:column;

    gap:10px;

    max-height:260px;

    overflow-y:auto;

}


#historyList li{

    padding:10px;

    border-radius:10px;

    background:var(--input-bg);

    display:flex;

    justify-content:space-between;

    gap:10px;

    font-size:.9rem;

}

#historyList li span.time{

    color:var(--text-muted);

    white-space:nowrap;

}

#historyList .empty{

    color:var(--text-muted);

    text-align:center;

    background:transparent;

}


/* ===========================================================
   Switches
=========================================================== */

.switch{

    display:flex;

    align-items:center;

    gap:10px;

    margin-bottom:12px;

}


.switch input{

    width:20px;

    height:20px;

    margin:0;

}


/* ===========================================================
   Footer
=========================================================== */

footer{

    padding:35px;

    text-align:center;

    color:var(--text-secondary);

}


/* ===========================================================
   Responsive
=========================================================== */

@media(max-width:1400px){

    .dashboard{

        grid-template-columns:

            320px

            1fr;

    }

    .right-panel{

        grid-column:span 2;

        display:grid;

        grid-template-columns:

            repeat(auto-fit,minmax(280px,1fr));

    }

}


@media(max-width:900px){

    .dashboard{

        grid-template-columns:1fr;

    }

    .right-panel{

        grid-column:auto;

        display:flex;

    }

}


@media(max-width:600px){

    h1{

        font-size:2rem;

    }

    .button-grid{

        grid-template-columns:1fr;

    }

}
/* ===========================
   WHEEL SECTION
=========================== */

.wheel-wrapper{
    position:relative;
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
}

canvas{
    width:100%;
    max-width:520px;
    height:auto;
}

/* Arrow */

.pointer{
    position:absolute;
    top:-8px;
    left:50%;
    transform:translateX(-50%);
    width:0;
    height:0;

    border-left:15px solid transparent;
    border-right:15px solid transparent;
    border-top:30px solid var(--danger);

    filter:drop-shadow(0 2px 5px rgba(0,0,0,.5));
}

.wheel-description{
    margin-top:15px;
    text-align:center;
}

/* ===========================
   RESULT
=========================== */

.result{
    margin-top:20px;
    padding:15px;

    text-align:center;
    font-size:1.15rem;
    font-weight:bold;

    background:rgba(255,255,255,.03);
    border-radius:12px;
    border:1px solid rgba(255,255,255,.06);

    transition:.3s;
}

.result.winner{
    color:var(--success);
    animation:pulse .8s;
}

/* ===========================
   ANIMATIONS
=========================== */

@keyframes pulse{

    0%{
        transform:scale(1);
    }

    50%{
        transform:scale(1.06);
    }

    100%{
        transform:scale(1);
    }

}

@keyframes fadeIn{

    from{
        opacity:0;
        transform:translateY(10px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }

}

.card{
    animation:fadeIn .4s ease;
}

/* Confetti */

.confetti-piece{
    position:fixed;
    top:-10px;
    width:8px;
    height:14px;
    opacity:.9;
    pointer-events:none;
    z-index:9999;
    animation:confetti-fall linear forwards;
}

@keyframes confetti-fall{

    to{
        transform:
            translateY(105vh)
            rotate(720deg);
        opacity:0;
    }

}

/* ===========================
   SCROLLBAR
=========================== */

::-webkit-scrollbar{
    width:10px;
}

::-webkit-scrollbar-track{
    background:var(--background-secondary);
}

::-webkit-scrollbar-thumb{
    background:#555;
    border-radius:20px;
}

::-webkit-scrollbar-thumb:hover{
    background:#777;
}

/* ===========================
   RESPONSIVE
=========================== */

@media (max-width:900px){

    .cols{
        flex-direction:column;
    }

    canvas{
        max-width:450px;
    }

}

@media (max-width:600px){

    body{
        padding:15px;
    }

    .container{
        padding:20px;
    }

    h1{
        font-size:2rem;
    }

    textarea{
        min-height:140px;
    }

    .row{
        flex-direction:column;
    }

    button{
        width:100%;
    }

    canvas{
        max-width:320px;
    }

}

/* ===========================
   ACCESSIBILITY
=========================== */

button:focus,
textarea:focus,
input:focus{

    outline:3px solid rgba(0,191,255,.45);

}

::selection{

    background:#00bfff;
    color:white;

}
