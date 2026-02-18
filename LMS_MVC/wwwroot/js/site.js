$(document).ready(function () {

    const welcomeKey = "welcomeModalShown";

    if (!sessionStorage.getItem(welcomeKey)) {

        const modalEl = document.getElementById('loginSuccessModal');

        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl, {
                backdrop: 'static',
                keyboard: false
            });

            modal.show();

            setTimeout(function () {
                modal.hide();
            }, 3000);

            sessionStorage.setItem(welcomeKey, "true");
        }
    }
    
    $(".notification").delay(3000).fadeOut("slow");

    $('input[name="Price"], input[name="Quantity"], input[name="MenuRolePermissionID"], input[name="MenuId"], input[name="MenuLevel"], input[name="DisplayOrder"]')
        .addClass('text-end')
        .on('focus', function () {
            if ($(this).val() === '0') {
                $(this).val('');
            }
        });
});


document.addEventListener("DOMContentLoaded", function () {

    var currentPath = window.location.pathname.toLowerCase();

    document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {

        var linkPath = link.getAttribute("href").toLowerCase();

        if (currentPath === linkPath || currentPath.startsWith(linkPath + "/")) {
            link.classList.add("active");
        }
    });

});

