const functions = require('firebase-functions');
  
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();

exports.webhook = functions.https.onRequest((request, response) => {

        
    switch (request.body.result.action) {

        case 'tambahCatatan': //nama action di intent

            let params = request.body.result.parameters;

            firestore.collection('catatan').add(params)
                .then(() => {

                    response.send({
                        speech:
                            `Catatan tentang ${params.catatan} untuk tanggal ${params.tanggal} di ${params.tempat} berhasil ditambahkan ${userId}`
                    });
                })
                .catch((e => {

                    console.log("error: ", e);

                    response.send({
                        speech: "Maaf ada kesalahan, mohon diulangi sekali lagi"
                    });
                }))
            break;

        case 'jumlahCatatan':

            firestore.collection('catatan').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        speech: `Kamu memiliki ${orders.length} catatan, mau dilihat? (ya/tidak)`
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "Maaf terjadi kesalahan saat akses database"
                    })
                })

            break;

        case 'listCatatan':

            firestore.collection('catatan').orderBy('tanggal').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = `Catatan yang telah dibuat : \n`;

                    orders.forEach((eachOrder, index) => {
                        speech += `${index + 1}. ${eachOrder.catatan} di ${eachOrder.tempat} tanggal ${eachOrder.tanggal} \n`//speech += `number ${index + 1} is ${eachOrder.RoomType} room for ${eachOrder.persons} persons, ordered by ${eachOrder.name} contact email is ${eachOrder.email} \n`
                    })

                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "Maaf terjadi kesalahan saat akses database"
                    })
                })

            break;

        case 'jumlahCatatan':

            firestore.collection('catatan').get()
                .then((querySnapshot) => {

                    var orders = [];
                    querySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        speech: `Kamu memiliki ${orders.length} catatan, mau dilihat? (ya/tidak)`
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "Maaf terjadi kesalahan saat akses database"
                    })
                })

            break;

        case 'hapusCatatan':

            let hapusParameter = request.body.result.parameters.tanggalHapus;

            firestore.collection('catatan').where('tanggal', '==', hapusParameter).get()
                .then((querySnapshot) => {

                    querySnapshot.forEach((doc) => {
                        doc.ref.delete().then(() => {
                            response.send({
                                speech: "Data catatan pada tanggal tersebut berhasil dihapus"
                            })
                        }).catch(function(error) {
                          console.error("Error removing document: ", error);
                        });
                      });
                    })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "Maaf terjadi kesalahan saat akses database"
                    })
                })

            break;

        default:
            response.send({
                speech: "no action matched in webhook"
            })
    }
});
//CMD
//npm install -g firebase-tools
//firebase login
//firebase init functions

//Terminal
//npm install firebase-admin --save >dir functions
//firebase deploy