
function actionFormatter(cellValue, options, row) {
    return `
        <div class="text-nowrap">
            <button class="btn btn-sm btn-warning btn-edit"
                    data-row='${JSON.stringify(row)}'>
                <i class="bi bi-pencil-square"></i>
            </button>
        </div>`;
}

function reloadMenuPermissionGrid() {
    $("#menuPermissionGrid")
        .jqGrid('setGridParam', { datatype: 'json', page: 1 })
        .trigger('reloadGrid');
}


function loadMenus() {
    return $.ajax({
        url: apiURL + 'Menu/MenuList?menuId=0',
        beforeSend: xhr => xhr.setRequestHeader("Authorization", "Bearer " + TOKEN)
    }).done(function (data) {
        const ddl = $('#MenuId').empty();

        ddl.append(`<option value="0">-- Select Menu --</option>`);

        data.forEach(m => {
            ddl.append(`<option value="${m.menuId}">${m.menuName}</option>`);
        });
    });
}


function loadRoles() {
    return $.ajax({
        url: apiURL + 'Role/GetRoles',
        beforeSend: xhr => xhr.setRequestHeader("Authorization", "Bearer " + TOKEN)
    }).done(function (data) {
        const ddl = $('#RoleID').empty();

        ddl.append(`<option value="0">-- Select Role --</option>`);

        data.forEach(r => {
            ddl.append(`<option value="${r.roleID}">${r.roleName}</option>`);
        });
    });
}

function openAddMenuPermissionModal() {

    $('#menuPermissionForm')[0].reset();

    $('#MenuRolePermissionID').val(0);

    $.when(loadMenus(), loadRoles()).done(function () {
        $('#menuPermissionModalTitle').text('Add Menu Permission');
        $('#menuPermissionModal').modal('show');
    });
}

function openEditMenuPermissionModal(row) {

    $('#MenuRolePermissionID').val(row.menuRolePermissionID);

    $.when(loadMenus(), loadRoles()).done(function () {

        $('#MenuId').val(row.menuId);
        $('#RoleID').val(row.roleID);

        $('#IsRead').prop('checked', row.isRead === true);
        $('#IsWrite').prop('checked', row.isWrite === true);

        $('#menuPermissionModalTitle').text('Edit Menu Permission');
        $('#menuPermissionModal').modal('show');
    });
}


$(document).on('click', '.btn-edit', function () {
    openEditMenuPermissionModal($(this).data('row'));
});


function booleanIconFormatter(value) {
    if (isExport) {
        return value ? "Yes" : "No";
    }

    return value
        ? "<i class='bi bi-check-circle-fill text-success'></i>"
        : "<i class='bi bi-x-circle-fill text-danger'></i>";
}


$(function () {

    const colModels = [
        { label: "Action", width: 60, formatter: actionFormatter, sortable: false, search: false, align: "center", exportcol: false },
        { label: "Permission ID", name: "menuRolePermissionID", key: true, width: 70, align: "right" },
        { label: "Menu ID", name: "menuId", width: 70, align: "right" },
        { label: "Role ID", name: "roleID", width: 70, align: "right" },
        {
            label: "Read",
            name: "isRead",
            width: 60,
            formatter: booleanIconFormatter,
            unformat: function (cellvalue, options, cell) {
                return $(cell).find('i').hasClass('bi-check-circle-fill')
                    ? 'Yes'
                    : 'No';
            },
            search: false,
            align: "center"
        },

       {
            label: "Write",
            name: "isWrite",
            width: 60,
            formatter: booleanIconFormatter,
            unformat: function (cellvalue, options, cell) {
                return $(cell).find('i').hasClass('bi-check-circle-fill')
                    ? 'Yes'
                    : 'No';
            },
            search: false,
            align: "center"
        }

    ];

    App.CreateJQGrid(
        '#menuPermissionGrid',
        apiURL + 'MenuPermission/PermissionList?roleId=0',
        'json',
        [],
        colModels,
        TOKEN,
        true,
        false,
        '55vh'
    );
});

submitModalForm({
    formSelector: '#menuPermissionForm',
    modalSelector: '#menuPermissionModal',
    onSuccess: reloadMenuPermissionGrid
});
