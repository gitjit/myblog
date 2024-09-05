document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('pre > code').forEach((codeBlock) => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.type = 'button';
        button.innerText = 'Copy';

        // Add event listener to copy the code
        button.addEventListener('click', () => {
            const code = codeBlock.innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerText = 'Copied!';
                setTimeout(() => {
                    button.innerText = 'Copy';
                }, 2000);
            }).catch(() => {
                button.innerText = 'Error';
            });
        });

        // Append the button to the <pre> element
        const pre = codeBlock.parentNode;
        if (pre && pre.tagName.toLowerCase() === 'pre') {
            pre.style.position = 'relative'; // Ensure <pre> is relatively positioned
            pre.insertBefore(button, codeBlock); // Insert button before the code block
        }
    });
});
