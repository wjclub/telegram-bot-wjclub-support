const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

const Markup = require('telegraf/markup')
const TelegrafI18n = require('telegraf-i18n')
const path = require('path')

// Set up translations
const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: true,
  directory: path.resolve(__dirname, 'locales')
})

bot.use(i18n.middleware())

// Setup menu handling
const menu = require('./menu.js')

bot.start(ctx => {
    ctx.replyWithHTML(ctx.i18n.t('support_start'), Markup.inlineKeyboard([
    Markup.callbackButton('Coke', 'Coke'),
    Markup.callbackButton('Dr Pepper', 'Dr Pepper'),
    Markup.callbackButton('Pepsi', 'Pepsi')
  ]).extra())
})

bot.help(ctx => {
  ctx.replyWithHTML(ctx.i18n.t('help'))
})



// Handle menu switches
bot.action(/menu\/(.+)/, ctx => {
  const menuId = ctx.match[1]
  if (menu.exists(menuId)) {
    const {text, extra} = menu.get(menuId, ctx)
    ctx.editMessageText(text, extra)
    ctx.answerCbQuery()
  } else {
    console.error('Attempt to access non-existant menu', menuId)
    return ctx.answerCbQuery(`There is no menu named ${menuId}!`)
  }
})


bot.inlineQuery((query, ctx) => {

  if ([127782573, 147631594].includes(ctx.from.id)) {
    ctx.i18n.locale('en')
    const results = [menu.getInline('start', ctx),menu.getInline('bot_down', ctx)]
    ctx.answerInlineQuery(results, {
      cache_time :1,
      is_personal : true
    })
  } else {
    ctx.answerInlineQuery([], {})
  }


})

bot.startPolling()
console.debug('Bot started and polling...')
