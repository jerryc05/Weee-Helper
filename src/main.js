// ==UserScript==
// @name         Weee Helper
// @author       jerryc05
// @namespace    https://github.com/jerryc05
// @supportURL   https://github.com/jerryc05/Weee-Helper
// @version      0.8
// @description  Some Weee helpers
// @match        https://sayweee.com/*
// @match        https://*.sayweee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sayweee.com
// @grant        none
// ==/UserScript==


(() => {
  'use strict'

  function parsePrice(x) {
    const p = parseFloat(x.querySelector('[class*="producsPrice"]').lastChild.textContent)
    const b = x.querySelector('[class*="basePrice_"]')
    return [p, b ? parseFloat(b.lastChild.textContent) : null]
  }

  // show discount rate
  setTimeout(() => {
    for (const x of document.querySelectorAll('[class*="resultItem_"]')) {
      const [p, b] = parsePrice(x)
      if (!b) continue
      const l = x?.querySelector('[class*="label_"]')
      if (!l) continue
      l.textContent = `${parseFloat(((b - p) / b * 100).toFixed(3))}% Off`
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
  setTimeout(() => {
    const d = document.querySelector('#rowToolRef>div:first-child')
    new MutationObserver((l, o) => {
      const r = d.querySelector('[class*="referFriendText_"]')
      if (!r) return
      r.remove()
      o.disconnect()
    }).observe(d, {subtree: true, childList: true})
  }, 0)

  // sort by discount rate/amount
  setTimeout(() => {
    const s = document.querySelector('[class*="sortSelectContainer_"]')
    const u = s.querySelector('ul')
    function f(u) {
      for (const x of ['Discount % CurPage', 'Discount $ CurPage']) {
        const l = u.querySelector('li:last-child').cloneNode(true)
        l.textContent = x
        l.onclick = () => {
          const items = document.querySelector('[class*="listContent_"]');
          [...items.children]
            .sort((a, b) => {
              const [p1, b1] = parsePrice(a)
              const [p2, b2] = parsePrice(b)
              if (!b2) return 0
              if (!b1) return 1
              return x.includes('%')
                ? ((p1 - b1) / p1) - ((p2 - b2) / p2)
                : (p1 - b1) - (p2 - b2)
            })
            .forEach(x => items.appendChild(x))
        }
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
