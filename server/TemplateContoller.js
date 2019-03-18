/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const crypto = require('crypto');
const dbUtil = require('./Db');

module.exports = dbPath => ({
  all: async () => {
    const db = await dbUtil.connect(dbPath);
    const result = await dbUtil.all(db, 'select * from log_templates');
    await dbUtil.close(db);
    return result;
  },
  one: async (id) => {
    const db = await dbUtil.connect(dbPath);
    const result = await dbUtil.get(db, 'select * from log_templates where id =?', id);
    await dbUtil.close(db);
    return result;
  },
  findByName: async (name) => {
    const db = await dbUtil.connect(dbPath);
    const result = await dbUtil.get(db, 'select * from log_templates where name =?', name);
    await dbUtil.close(db);
    return result;
  },
  deleteByName: async (name) => {
    const db = await dbUtil.connect(dbPath);
    await db.exec('BEGIN');
    const template = await dbUtil.get(db, 'select * from log_templates where name =?', name);
    await dbUtil.run(db, 'DELETE FROM log_template_details WHERE template_id = ?', template.id);
    await dbUtil.run(db, 'DELETE FROM log_templates WHERE name = ?', name);
    await db.exec('END');
    const allTemplate = await dbUtil.all(db, 'select * from log_templates');
    await dbUtil.close(db);
    return allTemplate;
  },

  getAllFiled: async () => {
    const db = await dbUtil.connect(dbPath);
    const result = await dbUtil.all(db, 'SELECT name, isfixed "isFixed" FROM log_template_fields ORDER BY UPPER(name)');
    await dbUtil.close(db);
    return result;
  },
  insertOrUpdate: async (templateObj) => {
    const { templateName, fieldItems } = templateObj;
    const db = await dbUtil.connect(dbPath);
    let template = await dbUtil.get(db, 'select * from log_templates where name =?', [templateName]);
    await db.exec('BEGIN');
    if (!template) {
      await dbUtil.run(db, 'INSERT INTO log_templates(name) VALUES(?)', templateName);
      template = await dbUtil.get(db, 'select * from log_templates where name =?', [templateName]);
    } else {
      await dbUtil.run(db, 'UPDATE log_templates SET update_date = datetime("now", "localtime") WHERE name=?', [
        templateName,
      ]);
    }
    // await db.exec('BEGIN');
    // update template name
    await dbUtil.run(db, 'DELETE FROM log_template_details WHERE template_id=?', template.id);
    fieldItems.forEach(async (item) => {
      // { "id": "field_item_1", "name": "DeviceTime", "number": "0", "regex": "" },
      const field = await dbUtil.get(db, 'select id from log_template_fields where name=?', item.name);
      await dbUtil.run(db, 'INSERT INTO log_template_details(template_id, field_id, number, regex) VALUES (?,?,?,?)', [
        template.id,
        field.id,
        item.number,
        item.regex,
      ]);
    });
    await db.exec('COMMIT');
    const allTemplate = await dbUtil.all(db, 'select * from log_templates');
    await dbUtil.close(db);
    return allTemplate;
  },

  getTemplateDetail: async (template) => {
    const db = await dbUtil.connect(dbPath);
    const templateDetails = await dbUtil.all(
      db,
      `SELECT td.id, tf.name, td.number, td.regex
        FROM log_template_details td, log_template_fields tf, log_templates t
        WHERE td.field_id = tf.id and td.template_id = t.id and t.name = ?
        ORDER BY UPPER(tf.name)`,
      [template],
    );
    dbUtil.close(db);
    return templateDetails;
  },
  genTemplate: async (template) => {
    const db = await dbUtil.connect(dbPath);
    const templateDetails = await dbUtil.all(
      db,
      `SELECT td.id, tf.name, tf.pattern, tf.isfixed, td.number, td.regex 
        FROM log_template_details td, log_template_fields tf, log_templates t
        WHERE td.field_id = tf.id and td.template_id = t.id and t.name = ?
        ORDER BY td.id`,
      [template],
    );
    const randomString = Math.random().toString(36);
    let templateString = `${template}\n`;
    if (templateDetails) {
      templateString += `${randomString}\n\n`;
      templateString += `$template ${template}, `;

      templateDetails.forEach((t) => {
        const pattern = t.pattern.replace('{{number}}', t.number).replace('{{regex}}', t.regex);
        const fieldTemplate = `\\"${t.name}\\":\\"${pattern}\\",`;
        templateString += fieldTemplate;
      });
      templateString = templateString.slice(0, -1);
      templateString = templateString.concat('}"\n\n');
      templateString += '##########\n';
      const checkSum = crypto
        .createHash('sha256')
        .update(`${template}${randomString}`)
        .digest('hex');
      templateString += `${checkSum}\n`;
      templateString += `if $fromhost-ip == '{#IPHERE}'
      then {
        action(type="omelasticsearch"
        template="${template}"
        searchIndex="<{#DOMAINHERE}-{now/h+7h{YYYY-MM-dd}}>"
        searchType="logevents"
        bulkmode="on"
        )
      }`;
      console.log(templateString);
    }
    dbUtil.close(db);
    const key = '18369Vr@Comm4473';
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encryptedString = cipher.update(templateString, 'utf8', 'base64');
    encryptedString += cipher.final('base64');
    return encryptedString;
  },
});
