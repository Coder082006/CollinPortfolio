function doPost(e) {
  try {
    const fields = (e && e.parameter) || {};
    const name = String(fields.Name || "").trim().slice(0, 120);
    const email = String(fields.Email || "").trim().slice(0, 254);
    const message = String(fields.Message || "").trim().slice(0, 10000);

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, message: "Please complete all fields." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, message: "Please enter a valid email address." });
    }

    const safeName = name.replace(/[\r\n]+/g, " ");
    MailApp.sendEmail({
      to: "collinmasumai@gmail.com",
      replyTo: email,
      subject: "Portfolio message from " + safeName,
      body: "You received a message through your portfolio contact form.\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Message:\n" + message
    });

    return jsonResponse({ ok: true, message: "Message sent successfully." });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, message: "The message could not be sent. Please try again." });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function authorizeEmailSending() {
  MailApp.getRemainingDailyQuota();
}
