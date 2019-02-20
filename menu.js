const menus = require('./menus.json')

exports.getInline = (key, ctx) => {
  const m = menus[key]
  const buttons = []
  Object.assign(buttons, m.buttons)

  for (let val of m.linkedMenus) {
    buttons.push([{
      text: '' + ctx.i18n.t('menu_'+val+'_title'),
      callback_data: 'menu/'+val
    }])
  }

  return {
    type: 'article',
    id: 'menu_'+key,
    title: ctx.i18n.t('menu_'+key+'_title'),
    input_message_content: {
      message_text: ctx.i18n.t('menu_'+key+'_text'),
      parse_mode: 'HTML',
      disable_web_page_preview: true
    },
    reply_markup: {
      inline_keyboard: buttons
    }
  }
}

exports.get = (key, ctx) => {
  const m = menus[key]
  const buttons = []
  Object.assign(buttons, m.buttons)

  for (let val of m.linkedMenus) {
    buttons.push([{
      text: '' + ctx.i18n.t('menu_'+val+'_title'),
      callback_data: 'menu/'+val
    }])
  }
  return {
    text: ctx.i18n.t('menu_'+key+'_text'),
    extra: {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: buttons
      }
    }
  }
}

exports.exists = (key) => {
  return (menus[key] !== undefined)
}
