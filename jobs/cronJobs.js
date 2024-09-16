import cron from 'node-cron';
import Fund from '../models/fundsModel.js';

cron.schedule('* * * * *', async () => { 
  const timeout = new Date(Date.now() - 30 * 1000); 

  try {
    const funds = await Fund.find({
      status: 'created',
      createdAt: { $lt: timeout }
    });

    if (funds.length > 0) {
      await Fund.updateMany(
        { status: 'created', createdAt: { $lt: timeout } },
        { status: 'failed' }
      );

      console.log('Updated failed orders');
    }
  } catch (error) {
    console.error('Error updating failed orders:', error.message);
  }
});
