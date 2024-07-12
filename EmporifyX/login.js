function validateForm() {
    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;
    var dob = document.getElementById("dob").value;
    var course = document.getElementById("cars").value;

    if (name.trim() === "") {
        alert("Please enter your name");
        return false;
    }

    if (age.trim() === "" || isNaN(age)) {
        alert("Please enter a valid age");
        return false;
    }

    if (dob.trim() === "") {
        alert("Please enter your date of birth");
        return false;
    }

    if (course === "select") {
        alert("Please select a course");
        return false;
    }

    return true;
}