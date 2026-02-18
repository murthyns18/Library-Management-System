function actionFormatter(cellValue, options, row) {
    return `
        <div class="text-nowrap">
            <button class="btn btn-sm btn-warning me-1 btn-edit" data-id="${row.categoryID}">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-delete"
                    data-id="${row.categoryID}"
                    data-name="${row.categoryName}">
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

function reloadCategoryGrid() {
    $("#categoryGrid")
        .jqGrid('setGridParam', {
            datatype: 'json',
            page: 1
        })
        .trigger('reloadGrid');
}

function openAddCategoryModal() {
    $('#categoryForm')[0].reset();
    $('#CategoryID').val(0);

    $('#statusContainer').addClass('d-none');

    $('#categoryModalTitle').text('Add Category');
    $('#categoryModal').modal('show');
}

function openEditCategoryModal(categoryId) {
    $.get('/Category/EditCategory', { categoryID: categoryId })
        .done(function (data) {

            $('#CategoryID').val(data.categoryID);
            $('#CategoryName').val(data.categoryName);
            $('input[name="IsActive"][value="' + data.isActive + '"]').prop('checked', true);

            $('#statusContainer').removeClass('d-none');

            $('#categoryModalTitle').text('Edit Category');
            $('#categoryModal').modal('show');
        })
        .fail(function () {
            App.alert('Failed to load category details.');
        });
}

async function deleteCategory(id, name) {

    const firstConfirm = await confirmAsync(`Are you sure you want to delete the category "${name}"?`);

    if (!firstConfirm) return;

    try {
        const result = await $.ajax({
            url: '/Category/DeleteCategory',
            type: 'POST',
            data: {
                categoryID: id,
                forceDelete: false,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            }
        });

        if (!result.success && result.hasBooks) {

            const secondConfirm = await confirmAsync(
                `The category "${name}" has books. Do you want to delete the category along with its books?`
            );

            if (!secondConfirm) return;

            const finalResult = await $.ajax({
                url: '/Category/DeleteCategory',
                type: 'POST',
                data: {
                    categoryID: id,
                    forceDelete: true,
                    __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
                }
            });

            if (finalResult.success) {
                $("#categoryGrid").jqGrid("delRowData", id);
            }

            App.alert(finalResult.message);
        }
        else if (result.success) {
            $("#categoryGrid").jqGrid("delRowData", id);
            App.alert(result.message);
        }
        else {
            App.alert(result.message);
        }
    }
    catch {
        App.alert("Delete failed");
    }
}

$(document).on('click', '.btn-edit', function () {
    openEditCategoryModal($(this).data('id'));
});

$(document).on('click', '.btn-delete', function () {
    deleteCategory($(this).data('id'), $(this).data('name'));
});


$(function () {

    const colModels = [
        { label: "Action", name: "action", width: 30, align: "center", sortable: false, search: false, formatter: actionFormatter, exportcol: false },
        { name: "categoryID", key: true, hidden: true },
        { label: "Category Name", name: "categoryName", width: 50 },
        {
            label: "Status",
            name: "isActive",
            width: 30,
            sortable: false,
            align: "center",
            formatter: statusFormatter,
            stype: "select",
            searchoptions: { value: ":All;true:Active;false:Inactive", sopt: ["eq"] }
        }
    ];

    App.CreateJQGrid(
        '#categoryGrid',
        apiURL + 'Category/CategoryList',
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
    formSelector: '#categoryForm',
    modalSelector: '#categoryModal',
    onSuccess: function () {
        reloadCategoryGrid();
    }
});
