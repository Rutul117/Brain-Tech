require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.0/min/vs",
    },
});

require(["vs/editor/editor.main"], function () {
    // Initialize Monaco Editor
    var editor = monaco.editor.create(document.getElementById("editor"), {
        value: "// console.log('Hello')",
        language: "javascript",
    });

    const languageSelect = document.getElementById("languageSelect");
    const convertButton = document.getElementById("convertButton");
    const debugButton = document.getElementById("debugButton");
    const qualityCheckButton = document.getElementById("qualityCheckButton");
    const runButton = document.getElementById("runButton")
    const output = document.getElementById("output");
    const baseURL = "https://fair-puce-stingray-ring.cyclic.app/";

    // Event listener for the "Run" button
    runButton.addEventListener("click", async () => {
        const code = editor.getValue();

        if (!code) {
            alert("Please enter code for executing.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/execute-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            if (response.ok) {
                const data = await response.json();
                output.innerHTML = `<div class="preclass"><code class="language-javascript">${data.output}</code></div>`;
                Prism.highlightAll();
            } else {
                alert("Code executing failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during code execution.");
        }
    });


    // Event listener for the "Convert" button
    convertButton.addEventListener("click", async () => {
        const code = editor.getValue();
        const targetLanguage = languageSelect.value;

        console.log(code, targetLanguage);
        if (!code || !targetLanguage) {
            alert("Please enter code and select a target language.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/convert-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, targetLanguage }),
            });

            if (response.ok) {
                const data = await response.json();
                const convertedCode = data.convertedCode;

                output.innerHTML = `<pre class="preclass"><code class="language-javascript">${convertedCode}</code></pre>
                `;
                Prism.highlightAll();
            } else {
                alert("Code conversion failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during code conversion.");
        }
    });

    // Event listener for the "Debug" button
    debugButton.addEventListener("click", async () => {
        const code = editor.getValue();

        if (!code) {
            alert("Please enter code for debugging.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/debug-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            if (response.ok) {
                const data = await response.json();
                output.innerHTML = `<div class="preclass"><code class="language-javascript">${data.debuggedCode}</code></div>
                `;
                Prism.highlightAll();
            } else {
                alert("Code debugging failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during code debugging.");
        }
    });

    // Event listener for the "Quality Check" button
    qualityCheckButton.addEventListener("click", async () => {
        const code = editor.getValue();

        if (!code) {
            alert("Please enter code for quality checking.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/quality-check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            if (response.ok) {
                const data = await response.json();
                output.innerHTML = `<pre class="preclass"><code class="language-javascript">${data.qualityAssessment}</code></pre>
                `;
                Prism.highlightAll();
            } else {
                alert("Code quality check failed.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during code quality checking.");
        }
    });
});
