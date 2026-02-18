    function Encrypt(str) {
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    var encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(str),
        key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return encrypted.toString();
}

var App = App || {};


App.alert = function (message) {
    $("#alertpopup").modal('show');
    $('#popupmesssage').html(message);
};

window.confirm = function (msg, func) {
    $('#confirmpopupmesssage').empty().html(msg);
    $('#confirmpopup').modal('show');
    if (func) {
        $("#ConfirmOKbutton").off("click").on("click", func);
    }
};

App.outputArrayMultiselect = [];

App.CallAjaxGET = function (URL, params, async) {
    $.ajax({
        type: "GET",
        url: ROOT + URL,
        data: params,
        async: async,
        dataType: "json",
        contentType: 'application/json',
        error: function () {
            App.alert("An error occurred.");
        }
    });
};

App.CallAjaxPOST = function (URL, params, async) {
    $.ajax({
        type: "POST",
        url: ROOT + URL,
        data: params,
        async: async,
        dataType: "json",
        contentType: 'application/json',
        error: function () {
            App.alert("An error occurred.");
        }
    });
};


App.CreateJQGrid = function (
    selector,
    url,
    dataType,
    params,
    colmodels,
    token,
    enableAuthorization = false,
    enableMultiselect = false,
    maxheight = "45vh",
    mtype = "GET"
) {

    $.jgrid.gridUnload(selector);

    $(selector).jqGrid({
        url: url,
        datatype: dataType,
        mtype: mtype,
        data: params,

        loadBeforeSend: function (jqXHR) {
            if (enableAuthorization && token) {
                jqXHR.setRequestHeader("Authorization", "Bearer " + token);
            }
        },

        colModel: colmodels,
        loadonce: true,
        viewrecords: true,
        autowidth: true,
        shrinkToFit: true,
        rowNum: enableMultiselect ? params.length : 1000,
        scroll: 1,
        pager: selector + '_pager',
        multiselect: enableMultiselect,

        beforeSelectRow: function (rowId, e) {
            return $(e.target).is("input:checkbox");
        },

        onSelectRow: enableMultiselect ? selectGridRow : null,
        onSelectAll: enableMultiselect ? selectAllGrid : null,

        jsonReader: {
            root: function (obj) {
                return typeof obj === "string" ? $.parseJSON(obj) : obj;
            },
            repeatitems: false
        },

        search: true,
        searchClearButton: true
    });

    $(selector).jqGrid('filterToolbar', {
        autosearch: true,
        searchOnEnter: false,
        defaultSearch: "cn"
    });

    $('.ui-jqgrid-bdiv').css({ 'max-height': maxheight });
};

function submitModalForm(options) {

    const {
        formSelector,
        modalSelector,
        onSuccess,
        clearOnOpen = true
    } = options;

    $(document).off('submit', formSelector);

    $(document).on('submit', formSelector, function (e) {
        e.preventDefault(); 

        const form = $(this);

        form.find('span.text-danger').text('');

        $.ajax({
            url: form.attr('action'),
            type: 'POST',
            data: form.serialize(),
            success: function (res) {

                if (res.success) {
                    $(modalSelector).modal('hide');

                    if (res.message) {
                        showNotification(res.message, 'success');
                    }

                    if (typeof onSuccess === 'function') {
                        onSuccess(res); 
                    }
                }
                else if (res.errors) {
                    $.each(res.errors, function (key, value) {
                        if (key) {
                            form
                                .find('span[data-valmsg-for="' + key + '"]')
                                .text(value);
                        } else {
                            App.alert(value);
                        }
                    });
                }
            },
            error: function () {
                App.alert('Operation failed');
            }
        });
    });

   
    if (clearOnOpen && modalSelector) {
        $(document).off('show.bs.modal', modalSelector);
        $(document).on('show.bs.modal', modalSelector, function () {
            $(this).find('span.text-danger').text('');
        });
    }
}

function showNotification(message, type = 'success') {

    const alertHtml = `
        <div class="alert alert-${type} mt-2 notification text-center mx-auto" style="width:350px;">
            ${message}
        </div>`;

    $('.notification').remove();
    $('.container.flex-fill').prepend(alertHtml);

    setTimeout(() => {
        $('.notification').fadeOut(500, function () {
            $(this).remove();
        });
    }, 3000);
}

var isExport = false;

App.exportToExcel = function (gridId, fileName) {
    isExport = true;
    $("#" + gridId).jqGrid("exportToExcel", {
        includeLabels: true,
        includeGroupHeader: true,
        includeFooter: true,
        exportUnformatted: true,  
        fileName: fileName + ".xlsx",
        maxlength: 200
    });
    isExport = false;
};

$(document).on("click", "#excelDownload", function () {
    App.exportToExcel($(this).data("grid"), $(this).data("file"));
});



// COMMON CONFIRM MODAL
function confirmAsync(message) {

    return new Promise(resolve => {

        const modalEl = document.getElementById('confirmpopup');
        const modal = new bootstrap.Modal(modalEl, {
            backdrop: 'static',
            keyboard: false
        });

        document.getElementById('confirmpopupmesssage').innerText = message;

        const okBtn = document.getElementById('ConfirmOKbutton');
        const cancelBtn = document.getElementById('ConfirmCancelbutton');

        const cleanUp = () => {
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
        };

        const onOk = () => {
            cleanUp();
            modal.hide();
            resolve(true);
        };

        const onCancel = () => {
            cleanUp();
            modal.hide();
            resolve(false);
        };

        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);

        modal.show();
    });
}
