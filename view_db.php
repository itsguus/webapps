<!DOCTYPE html>
<html>
<head>
    <title>CloudCase Tool Tracker</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <div class="trigger">
            <button onclick='fakeCarTrigger(this);'>Car ignition fake trigger</button>
            <p>A notification was sent to the driver saying a <span class="tool"></span> is missing. <br> [id:  <span class="id"></span>]</p>
            <p>The car starts, all is well.</p>
        </div>
    </header>
    <main>
    <section>
        <h1>Cloud<span>Case</span></h1>
        <div class="images">
            <h2>Your toolkit inventory</h2>
            <img class="fake__active" id="drill" src="/img/drill.png" alt="Drill illlustration">
            <img class="fake__active" id="english" src="/img/english.png" alt="english wrench illlustration">
            <img id="hammer" src="/img/hammer.png" alt="hammer illlustration">
            <img class="fake__active" id="pliers" src="/img/pliers.png" alt="pliers illlustration">
            <img class="fake__active" id="saw" src="/img/saw.png" alt="saw illlustration">
            <img class="fake__active" id="wrench" src="/img/wrench.png" alt="wrench illlustration">
        </div>
        <div class="bottom">
            <article class="log">
                <h3>Tracking log</h3>
                <ul>
                    <li></li>
                </ul>
            </article>
            <article class="errors">
                <h3>Errors</h3>
                <ul></ul>
            </article>
            <article class="money">
                <h3>Weather</h3>
                <p>You're in <span class="region"></span></p>
                <p>The weather will be <span class="description"></span></p>
            </article>
        </div>
    </section>
    </main>
    <footer>
    
    </footer>
   <script src="/script.js"></script>
</body>
</html>