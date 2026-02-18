$(document).ready(function () {

    $(".notification").delay(3000).fadeOut("slow");

    $("#togglePassword").on("click", function () {

        const input = $("#Password");
        const icon = $(this);

        if (input.attr("type") === "password") {
            input.attr("type", "text");
            icon.removeClass("bi-eye-slash").addClass("bi-eye");
        } else {
            input.attr("type", "password");
            icon.removeClass("bi-eye").addClass("bi-eye-slash");
        }

    });

});