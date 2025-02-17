document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('pre > code').forEach((codeBlock) => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.type = 'button';

        // Use Font Awesome icon and add "Copy code" text next to it
        button.innerHTML = '<i class="fas fa-copy"></i> Copy code';

        // Add event listener to copy the code
        button.addEventListener('click', () => {
            const code = codeBlock.innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Copied!'; // Change to check icon when copied
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> Copy code'; // Revert back to copy icon and text
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
