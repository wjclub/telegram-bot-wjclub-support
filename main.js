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


bot.help(ctx => {
  ctx.replyWithHTML(ctx.i18n.t('help'))
})



// Handle menu switches
bot.action(/menu\/(.+)/, async ctx => {
  const menuId = ctx.match[1]
  if (menu.exists(menuId)) {
    const {text, extra} = await menu.get(menuId, ctx)
    await ctx.editMessageText(text, extra)
    await ctx.answerCbQuery()
  } else {
    console.error('Attempt to access non-existant menu', menuId)
    await ctx.answerCbQuery(`There is no menu named ${menuId}!`)
  }
})


bot.inlineQuery(async (query, ctx) => {

  if ([127782573, 147631594].includes(ctx.from.id)) {
    ctx.i18n.locale('en')
    const results = [await menu.getInline('start', ctx), await menu.getInline('bot_down', ctx)]
    await ctx.answerInlineQuery(results, {
      cache_time :1,
      is_personal : true
    })
  } else {
    await ctx.answerInlineQuery([], {})
  }


})

bot.startPolling()
console.debug('Bot started and polling...')
