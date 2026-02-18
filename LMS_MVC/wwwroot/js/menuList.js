function actionFormatter(cellValue, options, row) {
    return `
        <div class="text-nowrap">
            <button class="btn btn-sm btn-warning me-1 btn-edit"
                    data-id="${row.menuId}">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-delete"
                    data-id="${row.menuId}" data-name="${row.menuName}">
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

function reloadMenuGrid() {
    $("#menuGrid")
        .jqGrid('setGridParam', { datatype: 'json', page: 1 })
        .trigger('reloadGrid');
}

function openAddMenuModal() {
    $('#menuForm')[0].reset();
    $('#MenuId').prop('readonly', false);
    $('#statusContainer').addClass('d-none');
    $('#menuModalTitle').text('Add Menu');
    $('#menuModal').modal('show');
}

function openEditMenuModal(menuId) {
    $.get('/Menu/EditMenu', { menuId })
        .done(function (data) {
            $('#MenuId').val(data.menuId).prop('readonly', true);
            $('#MenuName').val(data.menuName);
            $('#DisplayName').val(data.displayName);
            $('#MenuUrl').val(data.menuUrl);
            $('#MenuLevel').val(data.menuLevel);
            $('#DisplayOrder').val(data.displayOrder);
            $('#statusContainer').removeClass('d-none');
            $('input[name="IsActive"][value="' + data.isActive + '"]').prop('checked', true);
            $('#menuModalTitle').text('Edit Menu');
            $('#menuModal').modal('show');
        })
        .fail(function () {
            App.alert('Failed to load menu details.');
        });
}

async function deleteMenu(menuId, menuName) {

    const confirmDelete = await confirmAsync(`Are you sure you want to delete the menu "${menuName}"?`);

    if (!confirmDelete) return;

    try {
        const res = await $.post('/Menu/DeleteMenu', {
            menuId: menuId,
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        });

        App.alert(res.message);
        $("#menuGrid").jqGrid("delRowData", menuId);
    }
    catch {
        App.alert("Delete failed");
    }
}

$(document).on('click', '.btn-edit', function () {
    openEditMenuModal($(this).data('id'));
});

$(document).on('click', '.btn-delete', function () {
    deleteMenu($(this).data('id'), $(this).data('name'));
});


$(function () {

    const colModels = [
        {
            label: "Action",
            width: 100,
            formatter: actionFormatter,
            search: false,
            exportcol: false,
            sortable: false,
            align: "center"
        },
        { label: "Menu ID", name: "menuId", width: 80, key: true, align: "right" },
        { label: "Menu Name", name: "menuName", width: 180 },
        { label: "Display Name", name: "displayName", width: 180 },
        { label: "Menu Url", name: "menuUrl", width: 200 },
        { label: "Level", name: "menuLevel", width: 70, align: "right" },
        { label: "Order", name: "displayOrder", width: 70, align: "right" },
        {
            label: "Status",
            name: "isActive",
            width: 90,
            align: "center",
            sortable: false,
            formatter: statusFormatter,
            stype: "select",
            searchoptions: { value: ":All;true:Active;false:Inactive" }
        }
    ];

    App.CreateJQGrid(
        '#menuGrid',
        apiURL + 'Menu/MenuList?menuId=0',
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
    formSelector: '#menuForm',
    modalSelector: '#menuModal',
    onSuccess: function () {
        reloadMenuGrid();
    }
});
