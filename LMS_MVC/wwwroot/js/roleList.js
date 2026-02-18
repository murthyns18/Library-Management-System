function actionFormatter(cellValue, options, row) {
    return `
        <div class="text-nowrap">
            <button class="btn btn-sm btn-warning me-1 btn-edit" data-id="${row.roleID}">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-delete"
                    data-id="${row.roleID}"
                    data-name="${row.roleName}">
                <i class="bi bi-trash"></i>
            </button>
        </div>`;
}

function statusFormatter(cellValue) {
    if (isExport) {
        return cellValue ? "Active" : "Inactive";
    }
    return cellValue
        ? "<span class='badge bg-success'>Active</span>"
        : "<span class='badge bg-danger'>Inactive</span>";
}

function reloadRoleGrid() {
    $("#roleGrid")
        .jqGrid('setGridParam', {
            datatype: 'json',
            page: 1
        })
        .trigger('reloadGrid');
}


function openAddRoleModal() {
    $('#roleForm')[0].reset();
    $('#RoleID').val(0);

    $('#statusContainer').addClass('d-none');

    $('#roleModalTitle').text('Add Role');
    $('#roleModal').modal('show');
}


function openEditRoleModal(roleId) {
    $.get('/Role/EditRole', { roleID: roleId })
        .done(function (data) {

            $('#RoleID').val(data.roleID);
            $('#RoleName').val(data.roleName);
            $('input[name="IsActive"][value="' + data.isActive + '"]').prop('checked', true);
            $('#statusContainer').removeClass('d-none');
            $('#roleModalTitle').text('Edit Role');
            $('#roleModal').modal('show');
        })
        .fail(function () {
            App.alert('Failed to load role details.');
        });
}


async function deleteRole(roleId, name) {

    const firstConfirm = await confirmAsync( `Are you sure you want to delete the role "${name}"?`);

    if (!firstConfirm) return;

    try {
        const result = await $.ajax({
            url: '/Role/DeleteRole',
            type: 'POST',
            data: {
                roleID: roleId,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            }
        });

        if (result.success) {
            $("#roleGrid").jqGrid("delRowData", roleId);
        }

        App.alert(result.message);
    }
    catch {
        App.alert("Delete failed");
    }
}


$(document).on('click', '.btn-edit', function () {
    openEditRoleModal($(this).data('id'));
});

$(document).on('click', '.btn-delete', function () {
    deleteRole($(this).data('id'), $(this).data('name'));
});


$(function () {

    const colModels = [
        {
            label: "Action",
            name: "action",
            width: 30,
            align: "center",
            sortable: false,
            exportcol: false,
            search: false,
            formatter: actionFormatter
        },
        { name: "roleID", key: true, hidden: true },
        { label: "Role Name", name: "roleName", width: 50 },
        {
            label: "Status",
            name: "isActive",
            width: 30,
            align: "center",
            sortable: false,
            formatter: statusFormatter,
            stype: "select",
            searchoptions: {
                value: ":All;true:Active;false:Inactive",
                sopt: ["eq"]
            }
        }
    ];

    App.CreateJQGrid(
        '#roleGrid',
        apiURL + 'Role/GetRoles',
        'json',
        [],
        colModels,
        TOKEN,
        true,
        false,
        "55vh"
    );
});

submitModalForm({
    formSelector: '#roleForm',
    modalSelector: '#roleModal',
    onSuccess: function () {
        reloadRoleGrid();
    }
});
