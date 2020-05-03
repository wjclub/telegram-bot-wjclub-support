const menus = require('./menus.json')
const {getStatusForTelegram} = require('./simplemonitor-status.js')

exports.getInline = async (key, ctx) => {
  const m = menus[key]
  const buttons = []
  Object.assign(buttons, m.buttons)

  for (let val of m.linkedMenus) {
    buttons.push([{
      text: '' + ctx.i18n.t('menu_'+val+'_title'),
      callback_data: 'menu/'+val
    }])
  }

  let statusText = '';
  if (m.include_status) {
    statusText = '\n' + await getStatusForTelegram();
  }
  return {
    type: 'article',
    id: 'menu_'+key,
    title: ctx.i18n.t('menu_'+key+'_title'),
    input_message_content: {
      message_text: ctx.i18n.t('menu_'+key+'_text')+statusText,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    },
    reply_markup: {
      inline_keyboard: buttons
    }
  }
}

exports.get = async (key, ctx) => {
  const m = menus[key]
  const buttons = []
  Object.assign(buttons, m.buttons)

  for (let val of m.linkedMenus) {
    buttons.push([{
      text: '' + ctx.i18n.t('menu_'+val+'_title'),
      callback_data: 'menu/'+val
    }])
  }

  let statusText = '';
  if (m.include_status) {
    statusText = '\n' + await getStatusForTelegram();
  }
  return {
    text: ctx.i18n.t('menu_'+key+'_text')+statusText,
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
