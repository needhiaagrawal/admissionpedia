import { newQueries } from './queries/script.js';

import sequelize from '../config/db';
import moment from 'moment';
import fs from 'fs'
export const migrateDB = async () => {

    if (!newQueries.length) return;

    const executedQueries = [];

    console.log('DB migration started on ', moment().format('DD-MM-YY'))
    console.log('..................................',)
    console.log('It will take upto few minutes');
    await Promise.all(newQueries.map(async (query, index) => {
        try {
            console.log('Executing Query ', index + 1, ' : ', query);
            const queryResp = await sequelize.query(query);
            console.log('Status of Query ', index + 1, ' Done ', );
        } catch(err) {
            console.log('Error in Query ', index + 1, ' : ', err);

        }
        executedQueries.push(query.toString());
    }));
    console.log('Just about to bind up');
    console.log('Check logs for errors and success');

    console.log('..................................');

    const updatedOldQueries= [...executedQueries].map((query) => `"${query}"`);

    const historyText = `export const oldQueries = [${updatedOldQueries.join(',')}]`
    fs.appendFile('./migration/queries/history.txt', "\n" + historyText, (err) => {
        if (err) throw err;
        else{
           console.log("History file is updated with the executed queries")
        }
     })

     const scriptFileText = `export const newQueries = []`
     fs.writeFile('./migration/queries/script.js', scriptFileText, (err) => {
         if (err) throw err;
         else{
            console.log("Script file is updated with the executed queries")
         }
      })
}