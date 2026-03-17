function setTabMode(isNewTab) {

    document.querySelectorAll('.link').forEach(link => {
        link.target = isNewTab ? '_blank' : '_self';
        isNewTab ? link.rel = 'noopener noreferrer' : link.removeAttribute('rel');
    });

    const btnNew = document.querySelector('.newtabbutton');
    const btnReplace = document.querySelector('.replacetabbutton');

    if (isNewTab) {
        btnNew.classList.replace('off', 'on');
        btnReplace.classList.replace('on', 'off');
    } else {
        btnReplace.classList.replace('off', 'on');
        btnNew.classList.replace('on', 'off');
    }
}
