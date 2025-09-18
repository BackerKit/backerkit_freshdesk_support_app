init();

async function init() {
  const client = await app.initialized();
  client.events.on("app.activated", async function () {
    const contact = await client.data.get("contact");
    const requesterEmail = contact.contact.email;

    const domainName = (await client.data.get("domainName")).domainName;

    const iparams = await client.iparams.get();
    const secret = iparams.value_for_sha256;
    const callbackUrl = iparams.callback_url;

    const encoder = new TextEncoder();
    const data = encoder.encode(domainName + secret);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    client.instance.resize({ height: "500px" });

    const iframe = document.getElementById("callbackFrame");
    iframe.src = `${callbackUrl}?secret=${hashHex}&domain_name=${domainName}&customer[email]=${requesterEmail}`;
  });
}