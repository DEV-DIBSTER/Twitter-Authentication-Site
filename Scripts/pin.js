const root = document.getElementById('root');
const authLink = document.getElementById('links');
authLink.addEventListener('click', onAuthLinkClick);

function onAuthLinkClick() {
    root.innerHTML = `
    <div id="root">
        <center><h1>Please Type the Pin!</h1></center>

        <br>
        <br>

        <div>
            <center>
                <input id="pin-input" type="text" placeholder="Enter PIN here...">
                <button id="pin-validate" type="submit">Submit</button>
            <center>
        </div>
    </div>
    `;

    const pinInput = document.getElementById('pin-input');
    const pinValidate = document.getElementById('pin-validate');
    const pinForm = document.getElementById('pin-form');
    const handler = e => {
        e.preventDefault();
        e.stopPropagation();

        if (!pinInput.value) {
            alert('Please enter a valid PIN!');
            return;
        };

        validatePin();
    };

    pinValidate.addEventListener('click', handler);
    pinForm.addEventListener('submit', handler);
};

async function validatePin() {
    const pinInput = document.getElementById('pin-input');

    const { accessToken, accessSecret, userId, screenName } = await fetch('/validate-pin', {
        method: 'POST',
        body: JSON.stringify({ pin: pinInput.value }),
        headers: { 'Content-Type': 'application/json' },
    }).then(r => {
        if (r.ok) {
            return r.json();
        };

        return r.json().then(data => {
            alert(data.message);
            return Promise.reject(data);
        });
    });

    window.location.href = `/pin-redirect?accessToken=${accessToken}&accessSecret=${accessSecret}&userId=${userId}&screenName=${screenName}`;
};