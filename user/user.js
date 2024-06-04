$(document).ready(function () {
  $("#home").click(function () {
    window.location.href = "../index.html";
  });
  // Task
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");  
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  // start date as present and future date only
  $("#startDate").attr("min", today);
  $("#startDate").change(function () {
    var startDate = new Date($(this).val());
    var endDate = new Date(startDate);

    // Check if start date is Friday or Saturday
    if (startDate.getDay() == 5) {
      endDate.setDate(startDate.getDate() + 3); // Friday + 3 days
    } else if (startDate.getDay() == 6) {
      endDate.setDate(startDate.getDate() + 2); // Saturday + 2 days
    } else {
      endDate.setDate(startDate.getDate() + 1); // Sunday to Thursday + 1 day
    }

    // end date value
    var endDateFormatted = endDate.toISOString().split("T")[0];
    $("#endDate").val(endDateFormatted);
  });

  $("#form").submit(function (e) {
    e.preventDefault();
    if ($(this).valid()) {
      // Collect form data
      var formData = {
        username: $("#username").val(),
        location: $("#location").val(),
        employeeId: String($("#employeeId").val()),
        email: $("#email").val(),
        reason: $("#reason").val(),
        startDate: $("#startDate").val(),
        endDate: $("#endDate").val(),
      };

       
       
      postJsonData(formData);
    }
  });
  function postJsonData(jsonData) {
    console.log("submitted");
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/submit-form",
      contentType: "application/json",
      data: JSON.stringify(jsonData),
      success: function (response) {
        // success notification element
        var successNotification = $("<div>")
          .text("Form data submitted successfully")
          .addClass("notification notify-success");

        // Append  notification 
        $("body").append(successNotification);

        // Remove success notification  
        setTimeout(function () {
          successNotification.fadeOut(function () {
            $(this).remove();
          });
        }, 3000);
      },
      error: function (xhr, status, error) {
        //  error notification element
        var errorNotification = $("<div>")
          .text("Error submitting form data: " + error)
          .addClass("notification notify-error");

        // Append  notification  
        $("body").append(errorNotification);

        // Remove error notification  
        setTimeout(function () {
          errorNotification.fadeOut(function () {
            $(this).remove();
          });
        }, 3000);
      },
    });
  }

   

  // Add focus event handler for adding and removing * symbol
  $(".field").focus(function () {
    $(this).next("h5").find(".red-asterisk").hide();
  });

  $(".field").blur(function () {
    $(this).next("h5").find(".red-asterisk").show();
  });

//  validator
  $.validator.setDefaults({
    errorClass: "field-error",
    errorPlacement: function (error, element) {
      element.on("blur", function () {});
    },

    highlight: function (element, errorClass, validClass) {
      $(element).addClass(errorClass);

      $(element).next("h5").addClass("error");
    },

    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass(errorClass);

      $(element).next("h5").removeClass("error");
    },
  });
  $(".field").blur(function () {
    $(this).valid();
  });

  $("form").validate({
    rules: {
      username: "required",

      location: "required",

      employeeId: "required",

      email: "required",

      reason: "required",

      startdate: "required",

      enddate: "required",
    },
  });
});
