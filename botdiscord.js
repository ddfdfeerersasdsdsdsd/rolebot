const Discord = require('discord.js');
const prefix ="!";
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.on('message', message => {
  let id = "477435717472092160";
  let role = "VIP";
  let Price = 10000;
  let Price2 = Math.floor(Price-(Price*(1/100)));
  if(!Price || Price < 1) return;
  let cmd = message.content.split(' ')[0];
  if(cmd === `${prefix}buy`){
      if(message.author.bot) return ;
      if(!message.channel.guild) return;
      let vipembed = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setThumbnail(message.author.avatarURL)
      .setTitle(`**اختر الطريقه المناسبه بالنسبه لك**`)
      .addField(`**لشراء الرتبه لنفسك**`, `🔱`,true)
      .addField(`**لشراء الرتبه ك كود هديه**`, `🎁`,true)
      .setTimestamp()
      .setColor("PURPLE")
      .setFooter(client.user.username, client.user.displayAvatarURL)
      message.channel.send(vipembed).then(message2 => {
          message2.react("🔱").then(() => {
              message2.react("🎁").then(() => {
                  const forme = (reaction, user) => reaction.emoji.name === "🔱" && user.id === message.author.id;
                  const gift = (reaction, user) => reaction.emoji.name === "🎁" && user.id === message.author.id;
                  const formere = message2.createReactionCollector(forme, {time: 120000});
                  const giftre = message2.createReactionCollector(gift, {time: 120000});
                  formere.on("collect", r => {
                      message2.delete()
                      if(message.member.roles.find("name", role)) return message.reply(`**انت تمتلك الرتبه بالفعل!**`);
                      let rolefind = message.guild.roles.find("name", role);
                      if(!rolefind) return message.reply(`لا استطيع القيام بعملي لعدم توفر الرتبه \`${role}\``)
                      var purchasemeembed = new Discord.RichEmbed()
                      .setDescription(`لديك 4 دقائق لشراء الرتبه\nقم بتحويل مبلغ 10 الاف كريديت برو بوت/nالى : ${message.guild.members.get(id)}`)
                      .setColor("RED")
                      message.channel.send(purchasemeembed).then(um => {
               const filter = response => response.author.id == "477435717472092160" && response.mentions._content.includes(`:moneybag: | ${message.author.username}, has transferred \`$${Price2}\` to ${message.guild.members.get(id)}`);
                          message.channel.awaitMessages(filter, { maxMatches: 1, time: 240000, errors: ['time']})
                          .then(collected => {
                              um.delete()
                              var giveembed = new Discord.RichEmbed()
                              .setDescription(`**تم اعطائك الرتبه **\`${role}\``)
                              .setColor("PURPLE")
                              message.channel.send(giveembed);
                              message.member.addRole(rolefind);
                          }).catch(e => {})
                      })
                  })
                  giftre.on("collect", r => {
                      message2.delete()
                      let rolefind = message.guild.roles.find("name", role);
                      if(!rolefind) return message.reply(`**لا استطيع القيام بعملي لعدم توفر الرتبه \`${role}\``)
                      var purchasegiftembed = new Discord.RichEmbed()
                      .setDescription(`لديك 4 دقائق لشراء كود هديه للرتبة بتحويل مبلغ 5 الاف كريديت برو بوت الى : ${message.guild.members.get(id)}`)                        
                      .setColor("RED")
                      message.channel.send(purchasegiftembed).then(um => {
               const filter = response => response.author.id == "477435717472092160" && response.mentions._content.includes(`:moneybag: | ${message.author.username}, has transferred \`$${Price2}\` to ${message.guild.members.get(id)}`);
                          message.channel.awaitMessages(filter, { maxMatches: 1, time: 240000, errors: ['time']})
                          .then(collected => {
                              um.delete()
                              generateKey(message,rolefind);
                          }).catch(e => {});
                      })
                  })
              })
          })
      })
  }
  if(cmd === `${prefix}use`){
      let args = message.content.split(" ").slice(1)[0];
      if(!args){
          let insertcode = new Discord.RichEmbed()
          .setTitle(`:x: - **��لرجاء ادخال كود الهديه** \`${prefix}use <code>\``)
          .setColor("RED")
          message.reply(insertcode).then(m => m.delete(3000));
          return
      }
      let checkembed = new Discord.RichEmbed()
      .setTitle(`:writing_hand: - **جاري التحقق من الكود**`)
      .setColor("PURPLE")
      message.reply(checkembed).then( um => {
          if(GiftKeys[args]){
              let have = message.member.roles.find("name", GiftKeys[args].name);
              if(have){
                  let haveembed = new Discord.RichEmbed()
                  .setTitle(`:x: - **انت تمتلك الرتبه بالفعل**`)
                  .setColor("RED")
                  um.edit(haveembed)
                  return
              }
              let doneemed = new Discord.RichEmbed()
              .setTitle(`:tada: - **مبروك تم إعطائك الرتبه**`)
              .setColor("PURPLE")
              um.edit(doneemed)
              message.member.addRole(GiftKeys[args])
              delete GiftKeys[args]
              save()
          }else{
              let wrongembed = new Discord.RichEmbed()
              .setTitle(`:x: - **الكود غير صحيح او تم استعماله**`)
              .setColor("BLACK")
              um.edit(wrongembed)
          }
      });
  }
});


function generateKey(message,role){
  var randomKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var gift = "";
  for (var y = 0; y < 16; y++){
      gift += `${randomKeys.charAt(Math.floor(Math.random() * randomKeys.length))}`;
  }
  GiftKeys[gift] = role;
  let sendembed = new Discord.RichEmbed()
  .setTitle(`:white_check_mark: **تم ارسال الكود على الخاص!**`)
  .setColor("GREEN")
  message.reply(sendembed);
  message.author.send(`كود الهدية : ${gift}
  لإستعمال الكود : ${prefix}use ${gift}`);
  save()
}

function save(){
  fs.writeFile("./giftkeys.json", JSON.stringify(GiftKeys), (err) => {
      if (err) console.log(err)
  });
}




client.on('message', message => {
  if(message.content.startsWith(prefix + "vlp")){
      var emdeed = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setThumbnail(message.author.avatarURL)
      .addField("VIP | في اي بي",`**مميزات الرتبة :
      - سعر الرتب الفي اي بي 10 الاف كريديت برو بوت
      - رتبة راينبو -rainbow
      - قيف اوايات خاصه باعضاء الفي اي بي
      - شات خاص باعضاء الفي اي بي
      - للشراء -buy**`)
      message.channel.send(emdeed);
}
 


})


client.on('ready', () => {
  setInterval(function(){
      client.guilds.forEach(g => {
                  var role = g.roles.find('name', 'VIP Rainbow');
                  if (role) {
                      role.edit({color : "RANDOM"});
                  };
      });
  }, 13000);
})


client.on('message', message => {
  if(!message.channel.guild) return;
    if(message.content.startsWith(prefix + 'rainbow')) {
     let rrole = message.guild.roles.find('name', 'VIP Rainbow')
 if(message.member.roles.find('name','VIP Rainbow')) return message.channel.send(`عندك الرتبة !`);
         if(!message.member.roles.find('name','VIP')) return message.channel.send(`\`\`\`diff\n- هذا الامر فقط باعضاء الفي اي بي \`\`\``);
 message.member.addRole(rrole);
     var emdo = new Discord.RichEmbed()
     .setTitle(`:white_check_mark: **تم أعطائك الرتبة بنجاح!**`)
   message.channel.send(emdo);
    }
  })

client.login('NTc0NzMyMzkzNTIxNDc5Njgw.XM9rZQ.Ku18sZC9i_GhWvKhA0vJEaaVhdY');