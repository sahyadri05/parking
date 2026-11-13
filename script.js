// SmartPark - Vehicle Parking Management System
// Beginner-friendly JavaScript using simple variables, arrays, functions, and if-else conditions

// Storage keys for saving data in browser localStorage
var SLOTS_STORAGE_KEY = "smartpark_slots_v1";
var BOOKINGS_STORAGE_KEY = "smartpark_bookings_v1";
var LOGIN_STORAGE_KEY = "smartpark_logged_in_user_v1";
var RATES_STORAGE_KEY = "smartpark_rates_v1";

// Current active filter for parking slots ("All", "Available", "Booked", "Full")
var currentFilter = "All";

// Current logged-in role ("Admin" or "Customer")
var currentUserRole = "Customer";

// Arrays to hold parking slots, booking records, and vehicle hourly rates
var parkingSlots = [];
var bookings = [];
var vehicleRates = {
  twoWheeler: 10,
  threeWheeler: 15,
  fourWheeler: 20,
  heavyVehicle: 40
};

// Default initial parking slots (16 slots total)
function getDefaultSlots() {
  return [
    { slotNumber: "P1", zone: "Two Wheeler Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P2", zone: "Two Wheeler Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P3", zone: "Two Wheeler Zone", status: "Booked", vehicleNumber: "KA-05-MN-2210" },
    { slotNumber: "P4", zone: "Two Wheeler Zone", status: "Available", vehicleNumber: "" },

    { slotNumber: "P5", zone: "Three Wheeler Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P6", zone: "Three Wheeler Zone", status: "Full", vehicleNumber: "Occupied" },
    { slotNumber: "P7", zone: "Three Wheeler Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P8", zone: "Three Wheeler Zone", status: "Available", vehicleNumber: "" },

    { slotNumber: "P9", zone: "Four Wheeler Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P10", zone: "Four Wheeler Zone", status: "Booked", vehicleNumber: "MH-12-DE-4521" },
    { slotNumber: "P11", zone: "Four Wheeler Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P12", zone: "Four Wheeler Zone", status: "Full", vehicleNumber: "Occupied" },

    { slotNumber: "P13", zone: "Heavy Vehicle Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P14", zone: "Heavy Vehicle Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P15", zone: "Heavy Vehicle Zone", status: "Available", vehicleNumber: "" },
    { slotNumber: "P16", zone: "Heavy Vehicle Zone", status: "Available", vehicleNumber: "" }
  ];
}

// Default sample bookings matching the pre-booked slots P3 and P10
function getDefaultBookings() {
  return [
    {
      customerName: "Rahul Sharma",
      vehicleNumber: "KA-05-MN-2210",
      vehicleType: "Two Wheeler",
      slotNumber: "P3",
      hours: 3,
      totalFee: 30,
      status: "Occupied"
    },
    {
      customerName: "Priya Nair",
      vehicleNumber: "MH-12-DE-4521",
      vehicleType: "Four Wheeler",
      slotNumber: "P10",
      hours: 2,
      totalFee: 40,
      status: "Occupied"
    }
  ];
}

// Default hourly rates
function getDefaultRates() {
  return {
    twoWheeler: 10,
    threeWheeler: 15,
    fourWheeler: 20,
    heavyVehicle: 40
  };
}

// Load data from localStorage or use default demo data
function loadData() {
  var savedSlots = localStorage.getItem(SLOTS_STORAGE_KEY);
  var savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  var savedRates = localStorage.getItem(RATES_STORAGE_KEY);

  if (savedSlots && savedBookings) {
    parkingSlots = JSON.parse(savedSlots);
    bookings = JSON.parse(savedBookings);
  } else {
    parkingSlots = getDefaultSlots();
    bookings = getDefaultBookings();
    saveData();
  }

  if (savedRates) {
    vehicleRates = JSON.parse(savedRates);
  } else {
    vehicleRates = getDefaultRates();
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(vehicleRates));
  }
}

// Save slots and bookings to localStorage
function saveData() {
  localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(parkingSlots));
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

// Return hourly rate based on vehicle type using simple if-else conditions
function getHourlyRate(vehicleType) {
  if (vehicleType === "Two Wheeler") {
    return vehicleRates.twoWheeler;
  } else if (vehicleType === "Three Wheeler") {
    return vehicleRates.threeWheeler;
  } else if (vehicleType === "Four Wheeler") {
    return vehicleRates.fourWheeler;
  } else if (vehicleType === "Heavy Vehicle") {
    return vehicleRates.heavyVehicle;
  } else {
    return vehicleRates.fourWheeler;
  }
}

// Update category cards, dropdown options, and admin price inputs with current rates
function updateRateDisplays() {
  document.getElementById("rateTwoWheeler").textContent =
    "₹" + vehicleRates.twoWheeler + " / hour";
  document.getElementById("rateThreeWheeler").textContent =
    "₹" + vehicleRates.threeWheeler + " / hour";
  document.getElementById("rateFourWheeler").textContent =
    "₹" + vehicleRates.fourWheeler + " / hour";
  document.getElementById("rateHeavyVehicle").textContent =
    "₹" + vehicleRates.heavyVehicle + " / hour";

  var vehicleSelect = document.getElementById("vehicleType");
  vehicleSelect.options[0].textContent =
    "Two Wheeler (Bike / Scooter) - ₹" + vehicleRates.twoWheeler + "/hr";
  vehicleSelect.options[1].textContent =
    "Three Wheeler (Auto Rickshaw) - ₹" + vehicleRates.threeWheeler + "/hr";
  vehicleSelect.options[2].textContent =
    "Four Wheeler (Car) - ₹" + vehicleRates.fourWheeler + "/hr";
  vehicleSelect.options[3].textContent =
    "Heavy Vehicle (Truck / Bus) - ₹" + vehicleRates.heavyVehicle + "/hr";

  document.getElementById("priceTwoWheeler").value = vehicleRates.twoWheeler;
  document.getElementById("priceThreeWheeler").value = vehicleRates.threeWheeler;
  document.getElementById("priceFourWheeler").value = vehicleRates.fourWheeler;
  document.getElementById("priceHeavyVehicle").value = vehicleRates.heavyVehicle;
}

// Calculate and display total parking fee before confirming the booking
function calculateFee() {
  var vehicleType = document.getElementById("vehicleType").value;
  var hoursInput = document.getElementById("parkingHours").value;
  var hours = parseInt(hoursInput, 10);

  if (isNaN(hours) || hours < 1) {
    hours = 0;
  }

  var rate = getHourlyRate(vehicleType);
  var totalFee = rate * hours;

  document.getElementById("hourlyRateText").textContent = "₹" + rate + " / hour";
  document.getElementById("feeFormulaText").textContent =
    "₹" + rate + " × " + hours + " hour" + (hours === 1 ? "" : "s");
  document.getElementById("totalFeeText").textContent = "₹" + totalFee;
}

// Select vehicle category when user clicks a category card
function chooseVehicleCategory(categoryName) {
  var vehicleSelect = document.getElementById("vehicleType");
  vehicleSelect.value = categoryName;
  calculateFee();
  document.getElementById("book").scrollIntoView({ behavior: "smooth" });
}

// Update the 4 dashboard count cards
function updateDashboard() {
  var totalSlots = parkingSlots.length;
  var availableCount = 0;
  var bookedCount = 0;
  var fullCount = 0;

  for (var i = 0; i < parkingSlots.length; i++) {
    var slot = parkingSlots[i];
    if (slot.status === "Available") {
      availableCount = availableCount + 1;
    } else if (slot.status === "Booked") {
      bookedCount = bookedCount + 1;
    } else if (slot.status === "Full") {
      fullCount = fullCount + 1;
    }
  }

  var occupiedCount = bookedCount + fullCount;

  document.getElementById("totalSlotsCount").textContent = totalSlots;
  document.getElementById("availableSlotsCount").textContent = availableCount;
  document.getElementById("occupiedSlotsCount").textContent = occupiedCount;
  document.getElementById("bookedSlotsCount").textContent = bookedCount;
}

// Render all parking slot cards based on selected filter
function renderSlots() {
  var grid = document.getElementById("slotsGrid");
  grid.innerHTML = "";

  for (var i = 0; i < parkingSlots.length; i++) {
    var slot = parkingSlots[i];

    // Check filter condition
    if (currentFilter !== "All" && slot.status !== currentFilter) {
      continue;
    }

    var card = document.createElement("div");

    // Assign CSS class based on slot status using if-else
    if (slot.status === "Available") {
      card.className = "slot-card slot-available";
    } else if (slot.status === "Booked") {
      card.className = "slot-card slot-booked";
    } else {
      card.className = "slot-card slot-full";
    }

    // Build card HTML safely
    var slotNumDiv = document.createElement("div");
    slotNumDiv.className = "slot-number";
    slotNumDiv.textContent = slot.slotNumber;

    var slotZoneDiv = document.createElement("div");
    slotZoneDiv.className = "slot-zone";
    slotZoneDiv.textContent = slot.zone;

    var slotStatusDiv = document.createElement("div");
    slotStatusDiv.className = "slot-status-text";
    slotStatusDiv.textContent = slot.status;

    var extraDiv = document.createElement("div");
    extraDiv.className = "slot-vehicle-info";
    if (slot.status === "Available") {
      extraDiv.textContent = "Click to select";
    } else if (slot.status === "Booked") {
      extraDiv.textContent = "Vehicle: " + slot.vehicleNumber;
    } else {
      extraDiv.textContent = "Slot Occupied";
    }

    card.appendChild(slotNumDiv);
    card.appendChild(slotZoneDiv);
    card.appendChild(slotStatusDiv);
    card.appendChild(extraDiv);

    // Add click handler using closure helper
    card.onclick = createSlotClickHandler(slot.slotNumber);

    grid.appendChild(card);
  }
}

// Helper function for slot click events
function createSlotClickHandler(slotNumber) {
  return function () {
    handleSlotClick(slotNumber);
  };
}

// Helper function for release button click events
function createReleaseClickHandler(vehicleNumber) {
  return function () {
    releaseByVehicleNumber(vehicleNumber);
  };
}

// Handle clicking a parking slot card
function handleSlotClick(slotNumber) {
  var noticeBanner = document.getElementById("slotClickMessage");
  var clickedSlot = null;

  for (var i = 0; i < parkingSlots.length; i++) {
    if (parkingSlots[i].slotNumber === slotNumber) {
      clickedSlot = parkingSlots[i];
      break;
    }
  }

  if (!clickedSlot) {
    return;
  }

  if (clickedSlot.status === "Available") {
    noticeBanner.className = "notice-banner hidden";
    document.getElementById("slotSelect").value = clickedSlot.slotNumber;
    document.getElementById("book").scrollIntoView({ behavior: "smooth" });
  } else {
    noticeBanner.className = "notice-banner";
    noticeBanner.textContent =
      "Slot " +
      clickedSlot.slotNumber +
      " is currently " +
      clickedSlot.status +
      " (Occupied) and cannot be booked. Please pick a green Available slot.";
  }
}

// Filter parking slots by status
function filterSlots(statusFilter) {
  currentFilter = statusFilter;

  document.getElementById("filterAll").className = "filter-btn";
  document.getElementById("filterAvailable").className = "filter-btn";
  document.getElementById("filterBooked").className = "filter-btn";
  document.getElementById("filterFull").className = "filter-btn";

  if (statusFilter === "All") {
    document.getElementById("filterAll").className = "filter-btn active";
  } else if (statusFilter === "Available") {
    document.getElementById("filterAvailable").className = "filter-btn active";
  } else if (statusFilter === "Booked") {
    document.getElementById("filterBooked").className = "filter-btn active";
  } else if (statusFilter === "Full") {
    document.getElementById("filterFull").className = "filter-btn active";
  }

  renderSlots();
}

// Populate the booking dropdown with ONLY Available slots
function updateSlotDropdown() {
  var slotSelect = document.getElementById("slotSelect");
  slotSelect.innerHTML = "";

  var availableFound = 0;

  for (var i = 0; i < parkingSlots.length; i++) {
    var slot = parkingSlots[i];
    if (slot.status === "Available") {
      var option = document.createElement("option");
      option.value = slot.slotNumber;
      option.textContent = slot.slotNumber + " (" + slot.zone + ")";
      slotSelect.appendChild(option);
      availableFound = availableFound + 1;
    }
  }

  if (availableFound === 0) {
    var emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "No Available Slots (Parking Full)";
    slotSelect.appendChild(emptyOption);
  }
}

// Show helper list of currently parked vehicle numbers
function updateActiveVehiclesList() {
  var activeList = [];

  for (var i = 0; i < bookings.length; i++) {
    if (bookings[i].status === "Occupied") {
      activeList.push(bookings[i].vehicleNumber + " (" + bookings[i].slotNumber + ")");
    }
  }

  var textElement = document.getElementById("activeVehiclesList");
  if (activeList.length === 0) {
    textElement.textContent = "No vehicles are currently parked via booking.";
  } else {
    textElement.textContent = activeList.join(", ");
  }
}

// Render the Booking Summary table
function renderBookingSummary() {
  var tableBody = document.getElementById("summaryTableBody");
  tableBody.innerHTML = "";

  if (bookings.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 8;
    emptyCell.style.textAlign = "center";
    emptyCell.style.color = "#64748b";
    emptyCell.textContent = "No bookings recorded yet.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  // Show newest bookings at the top
  for (var i = bookings.length - 1; i >= 0; i--) {
    var booking = bookings[i];
    var row = document.createElement("tr");

    var nameCell = document.createElement("td");
    nameCell.textContent = booking.customerName;

    var vehicleCell = document.createElement("td");
    var vehicleStrong = document.createElement("strong");
    vehicleStrong.textContent = booking.vehicleNumber;
    vehicleCell.appendChild(vehicleStrong);

    var typeCell = document.createElement("td");
    typeCell.textContent = booking.vehicleType;

    var slotCell = document.createElement("td");
    slotCell.textContent = booking.slotNumber;

    var hoursCell = document.createElement("td");
    hoursCell.textContent = booking.hours + " hrs";

    var feeCell = document.createElement("td");
    var feeStrong = document.createElement("strong");
    feeStrong.textContent = "₹" + booking.totalFee;
    feeCell.appendChild(feeStrong);

    var statusCell = document.createElement("td");
    statusCell.textContent = booking.status;

    var actionCell = document.createElement("td");

    if (booking.status === "Occupied") {
      statusCell.className = "status-occupied";
      if (currentUserRole === "Admin") {
        var releaseButton = document.createElement("button");
        releaseButton.type = "button";
        releaseButton.className = "table-release-btn";
        releaseButton.textContent = "Release";
        releaseButton.onclick = createReleaseClickHandler(booking.vehicleNumber);
        actionCell.appendChild(releaseButton);
      } else {
        actionCell.textContent = "Use Release Form";
      }
    } else {
      statusCell.className = "status-released";
      actionCell.textContent = "Completed";
    }

    row.appendChild(nameCell);
    row.appendChild(vehicleCell);
    row.appendChild(typeCell);
    row.appendChild(slotCell);
    row.appendChild(hoursCell);
    row.appendChild(feeCell);
    row.appendChild(statusCell);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  }
}

// Handle Book Parking form submission
function bookParking(event) {
  event.preventDefault();

  var customerName = document.getElementById("customerName").value.trim();
  var vehicleNumber = document.getElementById("vehicleNumber").value.trim().toUpperCase();
  var vehicleType = document.getElementById("vehicleType").value;
  var selectedSlotNumber = document.getElementById("slotSelect").value;
  var hours = parseInt(document.getElementById("parkingHours").value, 10);

  var messageBox = document.getElementById("bookingMessage");

  // Basic validation using if-else
  if (customerName === "") {
    showMessage(messageBox, "Please enter the customer name.", false);
    return;
  }

  if (vehicleNumber === "") {
    showMessage(messageBox, "Please enter a valid vehicle number.", false);
    return;
  }

  if (selectedSlotNumber === "") {
    showMessage(messageBox, "Sorry, all parking slots are currently occupied!", false);
    return;
  }

  if (isNaN(hours) || hours < 1 || hours > 24) {
    showMessage(messageBox, "Please enter parking duration between 1 and 24 hours.", false);
    return;
  }

  // Check if this vehicle already has an active booking
  for (var i = 0; i < bookings.length; i++) {
    if (
      bookings[i].vehicleNumber === vehicleNumber &&
      bookings[i].status === "Occupied"
    ) {
      showMessage(
        messageBox,
        "Vehicle " +
          vehicleNumber +
          " is already parked in Slot " +
          bookings[i].slotNumber +
          ".",
        false
      );
      return;
    }
  }

  // Find the chosen slot and verify it is Available
  var slotIndex = -1;
  for (var j = 0; j < parkingSlots.length; j++) {
    if (parkingSlots[j].slotNumber === selectedSlotNumber) {
      slotIndex = j;
      break;
    }
  }

  if (slotIndex === -1 || parkingSlots[slotIndex].status !== "Available") {
    showMessage(
      messageBox,
      "This slot is already occupied! Please select another available slot.",
      false
    );
    return;
  }

  // Calculate total parking fee
  var hourlyRate = getHourlyRate(vehicleType);
  var totalFee = hourlyRate * hours;

  // Update slot status to Booked (Occupied)
  parkingSlots[slotIndex].status = "Booked";
  parkingSlots[slotIndex].vehicleNumber = vehicleNumber;

  // Save new booking record
  var newBooking = {
    customerName: customerName,
    vehicleNumber: vehicleNumber,
    vehicleType: vehicleType,
    slotNumber: selectedSlotNumber,
    hours: hours,
    totalFee: totalFee,
    status: "Occupied"
  };

  bookings.push(newBooking);
  saveData();

  // Refresh UI
  refreshAllViews();

  // Show confirmation message with booking details
  var confirmationLines = [
    "Booking Confirmed!",
    "Customer: " + customerName,
    "Vehicle: " + vehicleNumber + " (" + vehicleType + ")",
    "Slot: " + selectedSlotNumber + " | Duration: " + hours + " hrs",
    "Total Fee: ₹" + totalFee + " | Status: Occupied"
  ];

  showMessageLines(messageBox, confirmationLines, true);

  // Clear text inputs for next customer
  document.getElementById("customerName").value = "";
  document.getElementById("vehicleNumber").value = "";
  document.getElementById("parkingHours").value = "2";
  calculateFee();
}

// Handle Release Parking form submission
function releaseParking(event) {
  event.preventDefault();

  var inputNumber = document
    .getElementById("releaseVehicleNumber")
    .value.trim()
    .toUpperCase();

  releaseByVehicleNumber(inputNumber);
}

// Release a parked slot using vehicle number
function releaseByVehicleNumber(vehicleNumber) {
  var messageBox = document.getElementById("releaseMessage");

  if (vehicleNumber === "") {
    showMessage(messageBox, "Please enter a vehicle number to release.", false);
    return;
  }

  var foundBookingIndex = -1;
  for (var i = 0; i < bookings.length; i++) {
    if (
      bookings[i].vehicleNumber === vehicleNumber &&
      bookings[i].status === "Occupied"
    ) {
      foundBookingIndex = i;
      break;
    }
  }

  if (foundBookingIndex === -1) {
    showMessage(
      messageBox,
      "No active parking booking found for vehicle number: " + vehicleNumber,
      false
    );
    return;
  }

  var slotToRelease = bookings[foundBookingIndex].slotNumber;

  // Mark booking as Released
  bookings[foundBookingIndex].status = "Released";

  // Change the slot status back to Available
  for (var j = 0; j < parkingSlots.length; j++) {
    if (parkingSlots[j].slotNumber === slotToRelease) {
      parkingSlots[j].status = "Available";
      parkingSlots[j].vehicleNumber = "";
      break;
    }
  }

  saveData();
  refreshAllViews();

  document.getElementById("releaseVehicleNumber").value = "";
  showMessage(
    messageBox,
    "Slot " +
      slotToRelease +
      " has been released for vehicle " +
      vehicleNumber +
      " and is now Available.",
    true
  );
}

// Reset everything back to initial demo data
function resetDemoData() {
  parkingSlots = getDefaultSlots();
  bookings = getDefaultBookings();
  saveData();
  refreshAllViews();

  document.getElementById("bookingMessage").className = "message-box hidden";
  document.getElementById("slotClickMessage").className = "notice-banner hidden";
  showMessage(
    document.getElementById("releaseMessage"),
    "Demo parking data has been reset to default.",
    true
  );
}

// Utility function to display a single-line success or error message safely
function showMessage(element, messageText, isSuccess) {
  if (isSuccess) {
    element.className = "message-box message-success";
  } else {
    element.className = "message-box message-error";
  }
  element.textContent = messageText;
}

// Utility function to display multi-line confirmation details safely
function showMessageLines(element, lines, isSuccess) {
  if (isSuccess) {
    element.className = "message-box message-success";
  } else {
    element.className = "message-box message-error";
  }

  element.innerHTML = "";
  for (var i = 0; i < lines.length; i++) {
    var lineDiv = document.createElement("div");
    if (i === 0) {
      var strongTag = document.createElement("strong");
      strongTag.textContent = lines[i];
      lineDiv.appendChild(strongTag);
    } else {
      lineDiv.textContent = lines[i];
    }
    element.appendChild(lineDiv);
  }
}

// Admin function: Save updated hourly parking prices
function updatePrices(event) {
  event.preventDefault();

  var twoRate = parseInt(document.getElementById("priceTwoWheeler").value, 10);
  var threeRate = parseInt(document.getElementById("priceThreeWheeler").value, 10);
  var fourRate = parseInt(document.getElementById("priceFourWheeler").value, 10);
  var heavyRate = parseInt(document.getElementById("priceHeavyVehicle").value, 10);
  var priceMessage = document.getElementById("priceMessage");

  if (
    isNaN(twoRate) || twoRate < 1 ||
    isNaN(threeRate) || threeRate < 1 ||
    isNaN(fourRate) || fourRate < 1 ||
    isNaN(heavyRate) || heavyRate < 1
  ) {
    showMessage(priceMessage, "All hourly prices must be at least ₹1.", false);
    return;
  }

  vehicleRates.twoWheeler = twoRate;
  vehicleRates.threeWheeler = threeRate;
  vehicleRates.fourWheeler = fourRate;
  vehicleRates.heavyVehicle = heavyRate;

  localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(vehicleRates));
  updateRateDisplays();
  calculateFee();

  showMessage(
    priceMessage,
    "Parking prices updated! New rates: Bike ₹" +
      twoRate +
      ", Auto ₹" +
      threeRate +
      ", Car ₹" +
      fourRate +
      ", Heavy ₹" +
      heavyRate +
      " per hour.",
    true
  );
}

// Admin function: Reset hourly parking prices back to default
function resetDefaultPrices() {
  vehicleRates = getDefaultRates();
  localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(vehicleRates));
  updateRateDisplays();
  calculateFee();

  showMessage(
    document.getElementById("priceMessage"),
    "Hourly parking prices reset to default (₹10, ₹15, ₹20, ₹40).",
    true
  );
}

// Refresh all sections on the page
function refreshAllViews() {
  updateRateDisplays();
  updateDashboard();
  renderSlots();
  updateSlotDropdown();
  updateActiveVehiclesList();
  renderBookingSummary();
}

// Fill demo login username and password
function fillDemoLogin(roleChoice) {
  if (roleChoice === "admin") {
    document.getElementById("loginUsername").value = "admin";
  } else {
    document.getElementById("loginUsername").value = "customer";
  }
  document.getElementById("loginPassword").value = "1234";
  document.getElementById("loginMessage").className = "message-box hidden";
}

// Handle Login form submission using simple if-else conditions
function loginUser(event) {
  event.preventDefault();

  var username = document.getElementById("loginUsername").value.trim().toLowerCase();
  var password = document.getElementById("loginPassword").value.trim();
  var loginMessage = document.getElementById("loginMessage");

  if (username === "" || password === "") {
    showMessage(loginMessage, "Please enter both username and password.", false);
    return;
  }

  if (username === "admin" && password === "1234") {
    localStorage.setItem(LOGIN_STORAGE_KEY, "Admin");
    showAppDashboard("Admin");
  } else if (username === "customer" && password === "1234") {
    localStorage.setItem(LOGIN_STORAGE_KEY, "Customer");
    showAppDashboard("Customer");
  } else {
    showMessage(
      loginMessage,
      "Invalid username or password. Use admin / 1234 or customer / 1234.",
      false
    );
  }
}

// Show the main SmartPark dashboard after login and apply Admin vs Customer permissions
function showAppDashboard(userLabel) {
  currentUserRole = userLabel;

  document.getElementById("loginSection").className = "login-page hidden";
  document.getElementById("appSection").className = "";
  document.getElementById("loggedInUserText").textContent = "Welcome, " + userLabel;
  document.getElementById("loginMessage").className = "message-box hidden";
  document.getElementById("priceMessage").className = "message-box hidden";
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";

  var adminPriceSection = document.getElementById("adminPriceSection");
  var adminResetBox = document.getElementById("adminResetBox");
  var heroBanner = document.getElementById("heroBanner");
  var roleText = document.getElementById("roleDescriptionText");

  if (userLabel === "Admin") {
    adminPriceSection.className = "section-block";
    adminResetBox.className = "reset-box";
    heroBanner.className = "hero-banner hero-admin";
    roleText.textContent =
      "Admin Mode: You can change hourly parking prices, release any parked vehicle from the summary table, and reset demo data.";
  } else {
    adminPriceSection.className = "section-block hidden";
    adminResetBox.className = "reset-box hidden";
    heroBanner.className = "hero-banner hero-customer";
    roleText.textContent =
      "Customer Mode: Check available parking slots, calculate parking fees, book an open space, and release your vehicle when leaving.";
  }

  refreshAllViews();
  calculateFee();
}

// Logout user and return to the login page
function logoutUser() {
  localStorage.removeItem(LOGIN_STORAGE_KEY);
  document.getElementById("appSection").className = "hidden";
  document.getElementById("loginSection").className = "login-page";
}

// Check if a user is already logged in when page loads
function checkLoginStatus() {
  var savedUser = localStorage.getItem(LOGIN_STORAGE_KEY);
  if (savedUser) {
    showAppDashboard(savedUser);
  } else {
    document.getElementById("appSection").className = "hidden";
    document.getElementById("loginSection").className = "login-page";
  }
}

// Run when page finishes loading
window.onload = function () {
  loadData();
  calculateFee();
  refreshAllViews();
  checkLoginStatus();
};
