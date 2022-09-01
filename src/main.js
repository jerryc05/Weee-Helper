// ==UserScript==
// @name         Weee Helper
// @author       jerryc05
// @namespace    https://github.com/jerryc05
// @supportURL   https://github.com/jerryc05/Weee-Helper
// @version      0.6
// @description  Some Weee helpers
// @match        https://sayweee.com/*
// @match        https://*.sayweee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sayweee.com
// @grant        none
// ==/UserScript==


(() => {
  'use strict'

  // show discount rate
  setTimeout(() => {
    for (const x of document.querySelectorAll('[class*="resultItem_"]')) {
      const b = x.querySelector('[class*="basePrice_"]')
      if (!b) continue
      const p = parseFloat(x.querySelector('[class*="producsPrice"]').lastChild.textContent)
      const d = parseFloat(b.lastChild.textContent)

      const l = x?.querySelector('[class*="label_"]')
      if (!l) continue
      l.textContent = `${parseFloat(((d - p) / d * 100).toFixed(3))}% Off`
      l.style.fontWeight = 'bold'
      l.style.backgroundColor = 'red'
    }
  }, 0)

  // show total amount in cart
  setTimeout(() => {
    const c = document.querySelector('[class*="miniCartInHeaderText_"]')
    if (c !== null) {
      const bearer = `Bearer ${document.cookie.match(/auth_token=([^;]+)/)[1]}`
      fetch('https://api.sayweee.net/ec/so/porder/v3', {
        headers: { 'Authorization': bearer }
      }).then(x => x.json())
        .then(x => {
          c.textContent += `  $${x.object.total_price}`
        })
    }
  }, 0)

  // remove refer text
  setTimeout(document.querySelector('[class*="referFriendText_"]').remove, 0)

  // sort by discount rate/amount
  setTimeout(() => {
    const s = document.querySelector('[class*="sortSelectContainer_"]')
    const u = s.querySelector('ul')
    function f(u) {
      for (const x of ['Discount %', 'Discount $']) {
        const l = u.querySelector('li:last-child').cloneNode()
        l.textContent = x
        u.append(l)
      }
    }
    if (u) f(u)
    else new MutationObserver((l, o) => {
      const u = s.querySelector('ul')
      if (!u) return
      f(u)
      o.disconnect()
    }).observe(s, {subtree: true, childList: true})
  }, 0)
})()
