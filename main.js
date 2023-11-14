const { app, Menu, ipcMain, dialog, remote, BrowserWindow } = require('electron')
const Store = require('electron-store');
const {confirmar} = require('./mongoconexion')
const {productosModel} = require('./models/productos')
const {usuariosModel} = require('./models/usuarios')
const {registrarProductoWin} = require('./ventanas/registrarProducto.js')
const {ventanaInicioSesion} = require('./ventanas/iniciarSesion.js')
const {menu} = require('./ventanas/menu.js')
const { ventanaEditarUnProducto} = require('./ventanas/editarUnProd.js')
const {ventanaregistrarUsuario} = require('./ventanas/registrarUsuario.js')
const {ventanaGenerarEntrada} = require('./ventanas/generarEntrada.js')
const {ventanaGenerarSalida} = require('./ventanas/generarSalida.js')
const {reporteproductosModel} = require('./models/reporte_productos')
const {ventanaEspecificaciones} = require('./ventanas/especificaciones.js')
const {ventanaResetPwd} = require('./ventanas/resetpwd.js')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const XLSX = require('xlsx');
const XLSXStyle = require('xlsx-js-style');
const ExcelJS = require('exceljs');


const {inicio} = require('./ventanas/inicio.js') // ME QUEDE ACAAAAAAAAAAAAAAAAAAA

confirmar()
const store = new Store()

const ventanaInicio = ()=>{
    //registrarProductoWin()
    menu()
}


ipcMain.on('registroProducto', async (e,args)=>{
    const fechaActual = new Date();
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth() + 1
    const dia = fechaActual.getDate()
    const horas = fechaActual.getHours()
    const minutos = fechaActual.getMinutes()
    const segundos = fechaActual.getSeconds()
    const numeroAleatorio = Math.floor(Math.random() * 900) + 100;
    const codigo = numeroAleatorio

    const user = store.get('usuario')
    //royer@gmail.com
    if(args.descripcion == '' || args.unidadmedida == '' || args.marca == '' || args.categoria == '' || args.stock == '' || args.entrada == '' || args.observacion == '') return dialog.showMessageBox({
        type: 'error',
        title: 'conflict email',
        message: 'Algunos campos estan vacios',
        buttons: ['OK']
    })

    const productoRegistrado = new productosModel({
        fecha: dia + "/" + mes + "/" + año,
        fechaActualizacion: dia + "/" + mes + "/" + año,
        horaCreacion: horas + ':' + minutos + ':' + segundos,
        horaActualizacion: horas + ':' + minutos + ':' + segundos,
        codigo: codigo,
        descripcion: args.descripcion,
        unidadDeMedida: args.unidadmedida,
        marca: args.marca,
        categoria: args.categoria,
        almacen: "almacen 1",
        stockInicial: args.stockInicial,
        stockTotal: args.stock,
        entrada: 0,
        salida: 0,
        observacion: args.observacion,
        costoUnidad: args.costoTotal,
        costoInicial: args.costoInicial,
        costoTotal: args.costoTotal * args.stockInicial,
        registradoPor: user._id
    })
    //REPORTE PRODUCTO RECIEN INGRESADO
    const productoActualizado = new reporteproductosModel({
        fechaActualizacion: dia + "/" + mes + "/" + año,
        horaActualizacion: horas + ':' + minutos + ':' + segundos,
        codigo: codigo,
        descripcion: args.descripcion, // si esta
        unidadDeMedida: args.unidadmedida, // si esta
        marca: args.marca, // si esta
        categoria: args.categoria, // si esta
        almacen: "almacen 1",
        stockInicial: args.stockInicial,
        stockTotal: args.stock, // si esta
        cantidad_ingresada: args.stockInicial, // si esta
        cantidad_retirada: 0,
        salida: 0,
        observacion: args.observacion, // si esta
        costoUnidad: args.costoTotal,
        costoInicial: args.costoInicial,
        costoTotal: args.costoTotal * args.stockInicial,
        registradoPor: user._id
    })
    console.log("producto actualizado: ", productoActualizado)
    productoActualizado.save()
    // ***********************
    const productoEncontrado = await productosModel.find({descripcion: args.descripcion})
    console.log(productoEncontrado)
    if (productoEncontrado.length > 0) return dialog.showMessageBox({
        type: 'error',
        title: 'product conflict',
        message: '**** Producto ya existe ****\nSi desea aumentar la cantidad de este producto entonces modifiquelo',
        buttons: ['OK']
    })
    // INGRESAR REPORTE PRODUCTO
    console.log('producto: ',productoEncontrado)
    productoRegistrado.save()
    .then((registrado)=>{
        console.log(registrado)
        e.reply('nuevoProductoRegistrado', JSON.stringify(productoRegistrado))
        dialog.showMessageBox({
            type: 'info',
            title: 'Exitoso',
            message: 'Este producto ha sido registrado correctamente.',
            buttons: ['OK']
        })
    })

    
})

ipcMain.on('obtenerProductos', async (e,args)=>{
    const productos = await productosModel.find()
    e.reply('obtenerProductos', JSON.stringify(productos))
    console.log(productos)
    inicio(productos)
})

ipcMain.on('eliminar-producto', async (e,args)=>{
    const productoEliminado = await productosModel.findByIdAndDelete(args)
    console.log(productoEliminado)
    e.reply('producto-eliminado-satisfactorio', JSON.stringify(productoEliminado))
})

ipcMain.on('obtener-un-producto', async (e, args)=>{
    const productoEncontrado = await productosModel.findById(args)
    console.log(productoEncontrado)
    ventanaEditarUnProducto(productoEncontrado)
})

ipcMain.on('abrir-ventana-iniciar-sesion', async (e, args)=>{
    
    const ventana = BrowserWindow.fromWebContents(e.sender);
    ventana.close()
    console.log("inici")
    ventanaInicioSesion()
})

ipcMain.on('testUsuario', (e,args)=>{
    usuariosModel.find().then((usuarios)=>{
        e.reply('usuariosOtenidos', JSON.stringify(usuarios))
    }).catch(error =>{
        e.reply('error: ', error)
    })
    
})

ipcMain.on('ventana-iniciar-sesion', async (e, args)=>{
    console.log("clecck")
    console.log(args.correoval)
    console.log(args.contraval)
    console.log(args)
    const usuarioEncontrado = await usuariosModel.find({correo: args.correoval})
    console.log(usuarioEncontrado)
    
    if(usuarioEncontrado.length == 0) return dialog.showMessageBox({
        type: 'error',
        title: 'conflict email',
        message: 'Correo incorrecto 🕵️‍♂️🚫',
        buttons: ['OK']
    })
    console.log(args.contraval)

    console.log(usuarioEncontrado[0].contrasena)
    const validarContrasena = await usuariosModel.compararContraseña(args.contraval, usuarioEncontrado[0].contrasena)
    if (!validarContrasena) return dialog.showMessageBox({
        type: 'error',
        title: 'conflict password',
        message: 'Contraseña incorrecta 🔐🚫',
        buttons: ['OK']
    })

    store.set('usuario', usuarioEncontrado[0])
    
    dialog.showMessageBox({
        type: 'info',
        title: 'Welcome',
        message: 'Inicio de sesion exitoso ✔',
        buttons: ['OK']
    })
    //e.reply('usuarioIniciado', JSON.stringify(store.get(usuario)))    
    const ventana = BrowserWindow.fromWebContents(e.sender);
    ventana.close()
    
    registrarProductoWin()
})

ipcMain.on('volver-a-menu', (e,args)=>{
    const ventana = BrowserWindow.fromWebContents(e.sender);
    ventana.close()
    ventanaInicio()
})

ipcMain.on('ventana-registrar-usuario', (e,args)=>{
    const ventana = BrowserWindow.fromWebContents(e.sender);
    ventana.close()

    ventanaregistrarUsuario()
})

ipcMain.on('registrar-usuario', async (e,args)=>{
    console.log("register")
    console.log(args.nombreval)
    console.log(args.correoval)
    console.log(args.contraval)
    const correoRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/
    if (!correoRegex.test(args.correoval)) {
        return dialog.showMessageBox({
            type: 'error',
            title: 'Error',
            message: 'Por favor, ingrese un correo válido de Gmail, Yahoo o Outlook.',
            buttons: ['OK']
        });
    }
    const registro = new usuariosModel({
        nombre: args.nombreval, 
        correo: args.correoval,
        contrasena: await usuariosModel.encriptarContraseña(args.contraval),
        productos_ingresados:  [],
        productos_alterados: []
    })
    console.log(registro)
    const userFound = await usuariosModel.findOne({correo: args.correoval})
    if(userFound) return dialog.showMessageBox({
        type: 'error',
        title: 'Conflicto',
        message: 'Este correo ya esta en uso por otro usuario',
        buttons: ['OK']
    })
    const usuarioGuardado = await registro.save()
    console.log("usuario guardado: " , usuarioGuardado)
    dialog.showMessageBox({
        type: 'info',
        title: 'satisfactorio',
        message: 'Usuario registrado correctamente',
        buttons: ['OK']
    })
})

ipcMain.on('volver-al-menuEstandoenRegistro', (e,args)=>{
    console.log("click")
    const ventana = BrowserWindow.fromWebContents(e.sender);
    ventana.close()
    menu()
})

ipcMain.on('buscar-productos', async (event, textoBusqueda) => {
    try {
        const productosEncontrados = await productosModel.find({
            $or: [
                { descripcion: { $regex: textoBusqueda, $options: 'i' } }, // Búsqueda insensible a mayúsculas y minúsculas
                { categoria: { $regex: textoBusqueda, $options: 'i' } },
                { marca: { $regex: textoBusqueda, $options: 'i' } }
                // Agrega más campos de búsqueda si es necesario
            ]
        });

        event.reply('resultados-busqueda', JSON.stringify(productosEncontrados));
    } catch (error) {
        console.error(error);
        event.reply('resultados-busqueda', JSON.stringify([])); // Enviar una lista vacía en caso de error
    }
});

ipcMain.on('abrir-ventana-generar-entrada-producto', async (e, args)=>{    
    console.log("probando: ", args)
    const producto = await productosModel.find({_id: args})
    ventanaGenerarEntrada(producto)
    console.log(producto)
    console.log("xdddddd")
    e.reply('productoEncontrado', JSON.stringify(producto))    
})

ipcMain.on('abrir-ventana-generar-salida-producto', async (e,args)=>{
    console.log("probando: ", args)
    const producto = await productosModel.find({_id: args})
    ventanaGenerarSalida(producto)
    console.log(producto)
    console.log("xdddddd")
    e.reply('productoEncontrado', JSON.stringify(producto))
})

ipcMain.on('generarEntrada', async (e, args)=>{
    // HORA Y FECHA
    const fechaActual = new Date();
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth() + 1
    const dia = fechaActual.getDate()
    const horas = fechaActual.getHours()
    const minutos = fechaActual.getMinutes()
    const segundos = fechaActual.getSeconds()
    // ***********
    // GET USER
    const user = store.get('usuario')
    // ************
    console.log(args.body)
    console.log(args.id)
    if(args.numEnt < 0) return dialog.showMessageBox({
        type: 'error',
        title: 'Conflict',
        message: 'La cantidad ingresada no debe pasar de 0.',
        buttons: ['OK']
    })
    if(args.numEnt == '') return dialog.showMessageBox({
        type: 'error',
        title: 'Conflict',
        message: 'El campo no debe estar vacio',
        buttons: ['OK']
    })

    const numeroEntrada = args.numEnt
    const costoProducto = args.body.costoTotal
    const total = numeroEntrada * costoProducto

    const productoEntradaActualizada = await productosModel.findByIdAndUpdate(args.id, args.body, {new: true})
    const productoActualizado = new reporteproductosModel({
        fechaActualizacion: dia + "/" + mes + "/" + año,
        horaActualizacion: horas + ':' + minutos + ':' + segundos,
        codigo: args.body.codigo,
        descripcion: args.body.descripcion,
        unidadDeMedida: args.body.unidadDeMedida,
        marca: args.body.marca,
        categoria: args.body.categoria,
        almacen: args.body.almacen,
        stockInicial: args.body.stockInicial,
        stockTotal: args.body.stockTotal,
        cantidad_ingresada: args.numEnt,
        cantidad_retirada: 0,
        observacion: args.body.observacion,
        costoUnidad: args.body.costoUnidad,
        costoInicial: args.body.costoInicial,
        costoTotal: args.body.costoTotal,
        registradoPor: user._id
    })
    console.log("producto actualizado: ", productoActualizado)
    productoActualizado.save()
    console.log("producto Actualizado: ", productoEntradaActualizada)
    e.reply('productoActualizado', JSON.stringify(productoEntradaActualizada))
    dialog.showMessageBox({
        type: 'info',
        title: 'Exitoso',
        message: 'Modificado con exito, recuerde recargar la ventana de productos para ver los cambios',
        buttons: ['OK']
    })
})

ipcMain.on('generarSalida', async (e, args)=>{
    // HORA Y FECHA
    const fechaActual = new Date();
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth() + 1
    const dia = fechaActual.getDate()
    const horas = fechaActual.getHours()
    const minutos = fechaActual.getMinutes()
    const segundos = fechaActual.getSeconds()
    // ***********
    // GET USER
    const user = store.get('usuario')
    // ************
    console.log(args.body)
    console.log(args.id)


    const productoEntradaActualizada = await productosModel.findByIdAndUpdate(args.id, args.body, {new: true})
    const productoActualizado = new reporteproductosModel({
        fechaActualizacion: dia + "/" + mes + "/" + año,
        horaActualizacion: horas + ':' + minutos + ':' + segundos,
        codigo: args.body.codigo,
        descripcion: args.body.descripcion,
        unidadDeMedida: args.body.unidadDeMedida,
        marca: args.body.marca,
        categoria: args.body.categoria,
        almacen: args.body.almacen,
        stockInicial: args.body.stockInicial,
        stockTotal: args.body.stockTotal,
        cantidad_ingresada: 0,
        cantidad_retirada: args.numSal,
        observacion: args.body.observacion,
        costoUnidad: args.body.costoUnidad,
        costoInicial: args.body.costoInicial,
        costoTotal: args.body.costoTotal,
        registradoPor: user._id
    })
    productoActualizado.save()
    console.log("producto Actualizado: ", productoEntradaActualizada)
    e.reply('productoActualizadoSalida', JSON.stringify(productoEntradaActualizada))
    dialog.showMessageBox({
        type: 'info',
        title: 'Exitoso',
        message: 'Modificado con exito, recuerde recargar la ventana de productos para ver los cambios',
        buttons: ['OK']
    })
})

ipcMain.on('obtener-especificaciones', async (e,args)=>{
    const productoEncontrado = await productosModel.findById(args)
    console.log("producto encontrado wiii: ", productoEncontrado)
    console.log("codigo: ", productoEncontrado.codigo)
    const consulta = reporteproductosModel.find({ codigo: productoEncontrado.codigo });
    const productosActualizadoEncontrados = await consulta.populate('registradoPor', {_id: 0, __v: 0}).exec();
    ventanaEspecificaciones(productosActualizadoEncontrados)
    console.log("pAE: ", productosActualizadoEncontrados)
    e.reply('productosActualizadosEncontrados', JSON.stringify(productosActualizadoEncontrados))
    
})

ipcMain.on('obtener-especificaciones-por-fecha', async (e, fecha, codigo) => {
    const productosEncontrados = await reporteproductosModel.find({
        fechaActualizacion: fecha, // Utiliza el campo de fecha que corresponda en tu modelo
        codigo: codigo
    }).populate('registradoPor', { _id: 0, __v: 0 }).exec();

    
    e.reply('productosActualizadosEncontradosPorFecha', JSON.stringify(productosEncontrados));
});


ipcMain.on('generar-excel', (event, productos) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PRODUCTOS');

    // Agrega los nombres de las columnas a la primera fila
    const header = [
        'Fecha',
        'Código',
        'Descripción',
        'Unidad de Medida',
        'Marca',
        'Categoría',
        'Almacén',
        'Stock Inicial',
        'Stock Total',
        'Entrada',
        'Salida',
        'Costo por Unidad',
        'Costo Inicial',
        'Costo Total',
        'Observación'
    ];
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
        };
    });

    // Establece el estilo para la primera fila (color verde)
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00B050' } // Verde
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Establece el alto de la fila de encabezado en 51 y el ancho de las columnas según tus necesidades
    headerRow.height = 51
    worksheet.getColumn(1).width = 11;    
    worksheet.getColumn(2).width = 7;
    worksheet.getColumn(3).width = 40;        
    worksheet.getColumn(4).width = 12;    
    worksheet.getColumn(5).width = 16;  
    worksheet.getColumn(6).width = 16;      
    worksheet.getColumn(7).width = 11;    
    worksheet.getColumn(8).width = 13;    
    worksheet.getColumn(9).width = 11;   
    worksheet.getColumn(10).width = 10;     
    worksheet.getColumn(11).width = 10;   
    worksheet.getColumn(12).width = 13; 
    worksheet.getColumn(13).width = 12;     
    worksheet.getColumn(14).width = 35;     

    // Agrega los datos a la hoja de trabajo
    productos.forEach(producto => {
        worksheet.addRow([
            producto.fecha,
            producto.codigo,
            producto.descripcion,
            producto.unidadDeMedida,
            producto.marca,
            producto.categoria,
            producto.almacen,
            producto.stockInicial,
            producto.stockTotal,
            producto.entrada,
            producto.salida,
            producto.costoUnidad,
            producto.costoInicial,
            producto.costoTotal,
            producto.observacion
        ]);
    });

    worksheet.eachRow( (row, rowNumber) => {
        // Establece el mismo estilo de alineación y ajuste de texto que la primera fila
        row.eachCell((cell) => {
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
       
        if (rowNumber > 1) {
            row.getCell(14).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FABF8F' } // Rojo
            };
            row.getCell(13).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FABF8F' } // Rojo
            };
            row.getCell(12).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FABF8F' } // Rojo
            };
            row.getCell(11).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4B4B' } // Rojo
            };
            row.getCell(10).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '97FF89' } // Rojo
            };
            row.getCell(9).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // Rojo
            };
            row.getCell(8).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'AECEE4' } // Rojo FABF8F
            };
            
        }    
    });
    
    // Agrega un filtro a la fila de encabezado
    worksheet.autoFilter = `A1:N${worksheet.rowCount}`;

    dialog.showSaveDialog({
        filters: [
            { name: 'Archivos de Excel', extensions: ['xlsx'] },
            { name: 'Todos los archivos', extensions: ['*'] }
        ]
    }).then(result => {
        if (!result.canceled && result.filePath) {
            const excelFilePath = result.filePath;

            workbook.xlsx.writeFile(excelFilePath).then(() => {
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Reporte generado',
                    message: 'El archivo Excel ha sido generado con éxito en ' + excelFilePath,
                    buttons: ['OK']
                });
            }).catch(error => {
                dialog.showMessageBox({
                    type: 'error',
                    title: 'Error al generar el archivo Excel',
                    message: 'Error: ' + error.message,
                    buttons: ['OK']
                });
            });
        } else {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Operación cancelada',
                message: 'La generación del reporte ha sido cancelada.',
                buttons: ['OK']
            });
        }
    });
});

ipcMain.on('generar-excel-productos-alterados', (e, productos)=>{
    /*** TEST */
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PRODUCTOS_ESPECIFICACIONES');

    // Agrega los nombres de las columnas a la primera fila
    const header = [
        'Fecha Actualizacion',
        'Hora Actualizacion',
        'Codigo',
        'Descripcion',
        'Unidad de Medida',
        'Marca',
        'Categoria',
        'Almacen',
        'Stock Inicial',
        'Stock Total',
        'Entrada',
        'Salida',
        'Costo por Unidad',
        'Costo Inicial',
        'Costo Total',
        'Observación'
    ];
    
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
        };
    });

    // Establece el estilo para la primera fila (color verde)
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00B050' } // Verde
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Establece el alto de la fila de encabezado en 51 y el ancho de las columnas según tus necesidades
    headerRow.height = 51
    worksheet.getColumn(1).width = 11;    
    worksheet.getColumn(2).width = 9;
    worksheet.getColumn(3).width = 40;        
    worksheet.getColumn(4).width = 12;    
    worksheet.getColumn(5).width = 16;  
    worksheet.getColumn(6).width = 16;      
    worksheet.getColumn(7).width = 11;    
    worksheet.getColumn(8).width = 13;    
    worksheet.getColumn(9).width = 11;   
    worksheet.getColumn(10).width = 10;     
    worksheet.getColumn(11).width = 10;   
    worksheet.getColumn(12).width = 13; 
    worksheet.getColumn(13).width = 12;     
    worksheet.getColumn(14).width = 12;     
    worksheet.getColumn(15).width = 12;     
    worksheet.getColumn(16).width = 35;  

    // Agrega los datos a la hoja de trabajo
    productos.forEach(producto => {
        worksheet.addRow([
            producto.fechaActualizacion,
            producto.horaActualizacion,
            producto.codigo,
            producto.descripcion,
            producto.unidadDeMedida,
            producto.marca,
            producto.categoria,
            producto.almacen,
            producto.stockInicial,
            producto.stockTotal,
            producto.cantidad_ingresada,
            producto.cantidad_retirada,
            producto.costoUnidad,
            producto.costoInicial,
            producto.costoTotal,
            producto.observacion
        ]);
    });

    worksheet.eachRow( (row, rowNumber) => {
        // Establece el mismo estilo de alineación y ajuste de texto que la primera fila
        row.eachCell((cell) => {
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
       
        if (rowNumber > 1) {
            row.getCell(15).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FABF8F' } // Rojo
            };
            row.getCell(14).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FABF8F' } // Rojo
            };
            row.getCell(13).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FABF8F' } // Rojo
            };
            row.getCell(12).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4B4B' } // SALIDA
            };
            row.getCell(11).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '97FF89' } // ENTRADA
            };
            row.getCell(10).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // stock totaljo
            };
            row.getCell(9).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'AECEE4' } // STOCK INICIAL
            };                        
        }    
    });
    
    // Agrega un filtro a la fila de encabezado
    worksheet.autoFilter = `A1:N${worksheet.rowCount}`;

    dialog.showSaveDialog({
        filters: [
            { name: 'Archivos de Excel', extensions: ['xlsx'] },
            { name: 'Todos los archivos', extensions: ['*'] }
        ]
    }).then(result => {
        if (!result.canceled && result.filePath) {
            const excelFilePath = result.filePath;

            workbook.xlsx.writeFile(excelFilePath).then(() => {
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Reporte generado',
                    message: 'El archivo Excel ha sido generado con éxito en ' + excelFilePath,
                    buttons: ['OK']
                });
            }).catch(error => {
                dialog.showMessageBox({
                    type: 'error',
                    title: 'Error al generar el archivo Excel',
                    message: 'Error: ' + error.message,
                    buttons: ['OK']
                });
            });
        } else {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Operación cancelada',
                message: 'La generación del reporte ha sido cancelada.',
                buttons: ['OK']
            });
        }
    });
})

ipcMain.on('recargar-ventana', (e, any)=>{
    e.reply('recargar-ventana');
})

ipcMain.on('obtenerUsuario', (e,any)=>{
    const user = store.get('usuario')
    e.reply('obtenerUsuario', JSON.stringify(user))
})

ipcMain.on('actualizarProducto', async (e,args)=>{
    const prodActualizado = await productosModel.findByIdAndUpdate(args.id, args.body, {new: true})
    
    
    if (prodActualizado) return dialog.showMessageBox({
        type: 'info',
        title: 'Producto actualizado',
        message: 'Producto actualizado',
        buttons: ['OK']
    });
    else dialog.showMessageBox({
        type: 'warning',
        title: 'Error',
        message: 'No se pudo actualizar el producto.',
        buttons: ['OK']
    });
    console.log(prodActualizado)
})

ipcMain.on('volverObtenerProductos', async (e,args)=>{
    const productos = await productosModel.find()
    e.reply('productosObtenidosOtravez', JSON.stringify(productos))
})

ipcMain.on('abrir-ventana-reset-pwd', async (e,args)=>{
    ventanaResetPwd()
})

ipcMain.on('enviar-solicitud-reset-pwd', async (e,args)=>{
    const correoUsuarioSolicitud = args.correo
    const usuarioFound = await usuariosModel.findOne({correo: correoUsuarioSolicitud})
    if(!usuarioFound) return dialog.showMessageBox({
        type: 'error',
        title: 'Conflicto',
        message: 'Correo de usuario no encontrado.',
        buttons: ['OK']
    });

    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "almacenjpb@gmail.com",
        pass: "qrqw rxul abqs hbxf",
    },
    });

    console.log("antes de verificar")
    dialog.showMessageBox({
        type: 'info',
        title: 'Pendiente',
        message: 'Procesando solicitud...',
        buttons: ['OK']
    });

    const verificacion = await transporter.verify()
    if(!verificacion) return dialog.showMessageBox({
        type: 'error',
        title: 'Operación cancelada',
        message: 'Un error ha ocurrido.',
        buttons: ['OK']
    });

    console.log("ya verificado")

    const letrasYnumeros = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890'
    let codigo = ''

    for (let i = 0; i < 4 ; i++) {
        codigo += letrasYnumeros.charAt(Math.floor(Math.random() * letrasYnumeros.length))
    }

    const info = await transporter.sendMail({
        from: '"Contraseña olvidada 🔐" <almacenjpb@gmail.com>', // sender address
        to: correoUsuarioSolicitud, // list of receivers
        subject: "Contraseña olvidada 🔐 (Codigo para cambiar contraseña)", // Subject line
        text: `<b>Codigo: ${codigo}</b>`, // plain text body
        html: `<b>Codigo: ${codigo}</b>`, // html body
      });

    dialog.showMessageBox({
        type: 'info',
        title: 'Exitoso',
        message: 'Codigo enviado al correo, si no esta en la bandeja principal recuerda revisar en la bandeja de SPAM.',
        buttons: ['OK']
    });

    console.log("Message sent: %s", info.messageId);

    const token = jwt.sign({userId: usuarioFound._id, codigo: codigo}, 'pass123')
    console.log(token)
    e.reply('recibirCodigo', token)
})

ipcMain.on('verificarToken', (e,args)=>{
    console.log(args.token)
    console.log(args.cod)
    const tokenDestructurado = jwt.verify(args.token, 'pass123')
    console.log("desct : ", tokenDestructurado)
    if(args.cod != tokenDestructurado.codigo) return  dialog.showMessageBox({
        type: 'error',
        title: 'Codigo Error',
        message: 'El codigo no es correcto.',
        buttons: ['OK']
    });
    const token = jwt.sign({_id: tokenDestructurado.userId}, 'pass123')
    e.reply('solicitarNuevaContrasena', JSON.stringify(token))
    dialog.showMessageBox({
        type: 'info',
        title: 'satisfactorio',
        message: 'el codigo es correcto.',
        buttons: ['OK']
    });
})

ipcMain.on('cambiarContrasena', async (e,args)=>{
    console.log(args.token)
    console.log(args.newPass)
    const tokenDestructurado = jwt.verify(args.token, 'pass123')
    console.log("token destrucutrado pe: ", tokenDestructurado)
    const usuarioSolicitando = await usuariosModel.findById({_id: tokenDestructurado._id})
    if (!(usuarioSolicitando && args.token)) return dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'usuario no encontrado.',
        buttons: ['OK']
    });
    const passActualizado = await usuariosModel.updateOne({_id: tokenDestructurado._id},{$set: {contrasena: await usuariosModel.encriptarContraseña(args.newPass)}})
    if(!passActualizado) return dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'Un error ha ocurrido.',
        buttons: ['OK']
    }); 
    dialog.showMessageBox({
        type: 'info',
        title: 'Satisfactorio',
        message: 'Contraseña cambiada correctamente.',
        buttons: ['OK']
    });
    e.reply('contrasenaCambiada')
})

ipcMain.on('regresarPrincipal', async (e,args)=>{
    const ventana = BrowserWindow.fromWebContents(e.sender);
    ventana.close()
})

app.whenReady().then(()=>{
    ventanaInicio()
    //registrarProductoWin()
    const mainMenu =Menu.buildFromTemplate([])
    Menu.setApplicationMenu(mainMenu)
})


const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Productos',
                accelerator: 'Ctrl+N',
                click(){                    
                    inicio()
                }
            }
        ]        
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' }
        ]
    }
]