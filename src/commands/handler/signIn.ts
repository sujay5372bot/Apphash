/* eslint-disable prettier/prettier */
import { Context, InlineKeyboard } from "grammy";
import { signIn } from "../middleware";
import * as textHelp from "../../utils/textHelp.json";
import { toMarkdownV2 } from "../../utils/textManipulation";

const signInUser = async (ctx: Context): Promise<void> => {
    const inlineKeyboard = new InlineKeyboard()
            .text("🛠 Setup Auto Forward 🛠", "firstconnection")
            .url("📒 Get Documentation For Help 📒", "https://t.me/onefighterarmy")
    try {
        await ctx.reply("🚫 Please wait a moment, don't send anything");
        const result = await signIn(ctx)
        if (result == undefined) return
        await ctx.reply(textHelp.hasBeenConnected + result.data.name + " 👋", {
            reply_to_message_id: ctx.msg?.message_id, reply_markup: inlineKeyboard
        });
    } catch (error: any) {
        console.log(error);
        if (error.code == 401 && error.errorMessage == "SESSION_PASSWORD_NEEDED") {
            await ctx.reply(toMarkdownV2("Enter your 2FA Two-Factor-Authentication password using the **mypass:12345** format without space\n\n**Example:**\nmypass:udin_123"), {
                parse_mode: 'MarkdownV2'
            })
        } 
        
        if(error.message.includes("Cannot send requests while disconnected.")) {
            ctx.reply(toMarkdownV2("⚠ Sorry, make sure you have run \n\n**Command**\n/connect phone_number,\n\nyou can follow the instructions in the following documentation\n👉  [How to Connect](https://t.me/onefighterarmy)\n👉  [Commands Arguments Meaning](https://t.me/onefighterarmy)"), {
                parse_mode: 'MarkdownV2', disable_web_page_preview: true
            })
        }
    }
};

export default signInUser;
