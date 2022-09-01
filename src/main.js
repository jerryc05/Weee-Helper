// ==UserScript==
// @name         Weee Helper
// @author       jerryc05
// @namespace    https://github.com/jerryc05
// @supportURL   https://github.com/jerryc05/Weee-Helper
// @version      0.4
// @description  Some Weee helpers
// @match        https://sayweee.com/*
// @match        https://*.sayweee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sayweee.com
// @grant        none
// ==/UserScript==


(() => {
  'use strict'

  // show discount rate
  for (const x of document.querySelectorAll('[class*="price"]')) {
    const b = x.querySelector('[class*="basePrice"]')
    if (b === null) continue
    const p = parseFloat(x.querySelector('[class*="producsPrice"]').lastChild.textContent)
    const d = parseFloat(b.lastChild.textContent)
    const s = document.createElement('span')
    s.textContent = `-${((d - p) / d * 100).toFixed(0)}%`
    s.style.marginLeft = '.4rem'
    s.style.padding = '.1rem .4rem'
    s.style.borderRadius = '1rem'
    s.style.fontWeight = 'bold'
    s.style.backgroundColor = 'red'
    x.append(s)
  }

  // show total amount in cart
  const c = document.querySelector('[class*="miniCartInHeaderText"]')
  if (c !== null) {
    const bearer = `Bearer ${document.cookie.match(/auth_token=([^;]+)/)[1]}`
    fetch('https://api.sayweee.net/ec/so/porder/v3', {
      headers: { 'Authorization': bearer }
    }).then(x => x.json())
      .then(x => {
        c.textContent += `  $${x.object.total_price}`
      })
  }

  // remove refer text
  const r = document.querySelector('[class*="referFriendText"]')
  if (r !== null) r.remove()
})()
