;(function () {
  if (window.__helpdeskWidget) return
  window.__helpdeskWidget = true

  var baseUrl = document.currentScript
    ? document.currentScript.src.replace("/widget.js", "")
    : window.location.origin

  // Inject CSS
  var style = document.createElement("style")
  style.textContent = [
    "#helpdesk-btn{position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;background:#00c2ff;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,194,255,0.4);display:flex;align-items:center;justify-content:center;z-index:9999;transition:transform .15s}",
    "#helpdesk-btn:hover{transform:scale(1.08)}",
    "#helpdesk-btn svg{width:24px;height:24px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
    "#helpdesk-frame{position:fixed;bottom:88px;right:24px;width:380px;height:540px;border:none;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.18);z-index:9998;transition:opacity .2s,transform .2s;transform-origin:bottom right}",
    "#helpdesk-frame.hidden{opacity:0;pointer-events:none;transform:scale(0.92)}",
  ].join("")
  document.head.appendChild(style)

  // Chat icon SVG
  var btnIcon =
    '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'

  // Close icon SVG
  var closeIcon =
    '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

  // Button
  var btn = document.createElement("button")
  btn.id = "helpdesk-btn"
  btn.setAttribute("aria-label", "Open support")
  btn.innerHTML = btnIcon
  document.body.appendChild(btn)

  // iframe
  var frame = document.createElement("iframe")
  frame.id = "helpdesk-frame"
  frame.src = baseUrl + "/widget"
  frame.className = "hidden"
  frame.title = "Support"
  document.body.appendChild(frame)

  var open = false
  btn.addEventListener("click", function () {
    open = !open
    frame.classList.toggle("hidden", !open)
    btn.innerHTML = open ? closeIcon : btnIcon
    btn.setAttribute("aria-label", open ? "Close support" : "Open support")
  })
})()
