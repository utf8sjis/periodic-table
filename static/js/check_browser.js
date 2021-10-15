function closeAlertIEModal() {
    document.getElementById('alertIE').style.display = 'none';
}

const userAgent = window.navigator.userAgent.toLowerCase();
if (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
    document.getElementById('alertIE').style.display = 'block';
}
