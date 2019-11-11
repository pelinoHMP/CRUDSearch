$(document).ready(function () {
    retrieveItems();

    function retrieveItems() {
        $.ajax({
            url: "item/retrieve/all",
            type: "GET",
            crossDomain: true,
            success: (data) => {
                $('tbody').empty();
                for (let i = 0; i < data.results.length; i++) {
                    addRow(data.results[i])

                }
            }
        })
    }

    function addRow(item) {
        var tr = $("<tr>", {
            id: item._id,
            name: item.name,
            quan: item.quan,
            prio: item.prio
        });
        var btns = $("<div>").append($("<button>", {
            class: "btn btn-primary update btn-sm up",
            "data-toggle": "modal",
            "data-target": '#exampleModal',
            id: "update_" + item._id,
        }).text("update"),
            $("<button>", {
                class: "btn btn-danger del btn-sm",
                id: "delete_" + item._id,
            }).text("delete")
        )
        $(tr).append(
            $("<td>", {
                class: "forName"
            }).text(item._id),
            $("<td>", {
                class: "forName"
            }).text(item.name),
            $("<td>", {
                class: "forQuan"
            }).text(item.quan),
            $("<td>", {
                class: "forPrio"
            }).text(item.prio),
            $("<td>").append(btns)
        ).appendTo($('tbody'))
    }

    $(document).on("click", ".del", function () {
        $(this).parent().parent().parent().fadeOut("slow")
    })

    $("#btnAdd").click(function () {
        var validName = $('#name').val();
        var validNumber = $('#quantity').val()
        var validPrio = $('#priority').val()
        var valid = true;
        $('.form-control').each(function () {
            if (!$("#name").val()) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Name should be filled!!',
                    showConfirmButton: false,
                    timer: 1000
                })
            } else if (!$("#quantity").val()) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Quantity should be filled!!',
                    showConfirmButton: false,
                    timer: 1000
                })
            } else if (!$("#priority").val() || $("#priority").val() > 3) {
                valid = false;
                Swal.fire({
                    type: 'error',
                    title: 'Priority should be filled and must be below 3!!',
                    showConfirmButton: false,
                    timer: 1000
                })

            }
        })
        if (valid) {
            var formData = {
                name: $("#name").val(),
                quan: $("#quantity").val(),
                prio: $("#priority").val()
            }

            $.ajax({
                url: "/item/create",
                crossDomain: true,
                data: formData,
                success: function (result) {
                    console.log(formData)
                    console.log(result)
                    Swal.fire({
                        type: 'success',
                        title: 'Add Success!',
                        text: 'Item has been added!!!',
                        showConfirmButton: false,
                        timer: 1500,
                    })

                    addRow(result)
                    $('input').val("")
                },
                error: function (e) {
                    Swal.fire({
                        type: 'error',
                        title: 'Item Name already exist!!!!',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    console.log("ERROR: ", e);
                }
            });

        }
    })

    function retrieveSearchItem(id) {
        $.ajax({
            url: "item/retrieve/" + id,
            crossDomain: true,
            success: function (data) {
                console.log('Name: '+data.name);
                console.log(data.prio);                
                addRow(data)
            },
            error: function (e) {
                console.log(e);
            }
        })
    }


    $("#btnSearch").click(function (e) {
        var name = $('#searchItem').val()
        $('tbody').empty();
        retrieveSearchItem(name)
    })



    $(document).on("click", ".del", function () {
        var formData = {
            name: $("#name").val(),
            quan: $("#quantity").val(),
            prio: $("#priority").val()
        }
        var id = $(this).attr('id').split('_')
        $.ajax({
            url: "/item/delete/" + id[1],
            crossDomain: true,
            data: formData,
            success: function (result) {
                console.log('Success!!')
                console.log(data);
            },
            error: function (e) {
                console.log("ERROR: ", e);
            }
        });
    })

    $(document).on("click", ".update", function () {
        var updateId = $(this).parent().parent().parent().attr("id");
        retrieveOneItem(updateId)

    })

    $("#btnUpdated").click(function () {
        var key = $(this).attr("key");
        var data = {
            "name": $('#updateName').val(),
            "quan": $('#updateQuan').val(),
            "prio": $('#updatePrio').val()
        }
        updateItem(key, data)
    })

    //update Item function
    function updateItem(id, newData) {
        console.log(id)
        $.post({
            url: "/item/update",
            data: {
                id: id,
                newData: newData
            },
            dataType: 'JSON',
            success: function (data) {
                $('#' + data._id + " td.forName").text(data.name)
                $('#' + data._id + " td.forQuan").text(data.quan)
                $('#' + data._id + " td.forPrio").text(data.prio)
            },
            error: function (e) {
                Swal.fire({
                    type: 'error',
                    title: 'Item Name already exist!!!!',
                    showConfirmButton: false,
                    timer: 1000
                })
                console.log(e);
            }
        })
    }

    function retrieveOneItem(id) {
        $.ajax({
            url: "item/retrieve/" + id,
            crossDomain: true,
            success: function (data) {
                console.log(data)
                $('#updateName').val(data.name);
                $('#updateQuan').val(data.quan);
                $('#updatePrio').val(data.prio);
                $("#btnUpdated").attr("key", data._id)
            },
            error: function (e) {
                console.log(e);
            }
        })
    }

})
