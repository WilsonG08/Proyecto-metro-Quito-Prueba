import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import Mensajes from "./Mensajes";
import { useAlert } from 'react-alert'

const Formulario = ({ setEstado, idMetro }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const alert = useAlert()
    const [error, setError] = useState(false);
    const [mensaje, setMensaje] = useState(false);
    const [recargar, setRecargar] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        sector: "",
        salida: "",
        llegada: "",
        maquinista: "",
        detalles: ""
    });
    useEffect(() => {
        if (recargar) {
            alert.show('El registro se actualizo con éxito :3'); // Mostrar alerta
            setTimeout(() => {
                window.location.reload(); // Recargar la página después de mostrar la alerta
            }, 3000);
        }
    }, [recargar])
    


    useEffect(() => {
        if (idMetro) {
            (async function () {
                try {
                    const respuesta = await fetch(`https://64d01a7dffcda80aff526884.mockapi.io/metro/${idMetro}`);
                    const data = await respuesta.json();
                    setForm(data);
                    Object.keys(data).forEach(key => {
                        setValue(key, data[key]);
                    });
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, [idMetro, setValue]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const onSubmit = async () => {

        // Comprobar si hay errores en los campos del formulario

        if (Object.values(form).includes("")) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 1000);
            return;
        }

        //cometarios
        try {
            if (form.id) {
                const url = `https://64d01a7dffcda80aff526884.mockapi.io/metro/${form.id}`;
                await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(form),
                    headers: { 'Content-Type': 'application/json' }
                });
                setEstado(true);
                setMensaje(true);
                setTimeout(() => {
                    setMensaje(false);
                    setRecargar(true)
                    setEstado(false);
                }, 1000);
            }
            else {
                const url = "https://64d01a7dffcda80aff526884.mockapi.io/metro/";
                form.id = uuidv4();
                await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(form),
                    headers: { 'Content-Type': 'application/json' }
                });
                setMensaje(true);
                setEstado(true);
                setTimeout(() => {
                    setMensaje(false);
                    setEstado(false);
                    alert.show('Registro exitoso'); // Mostrar alerta
                    setForm({});
                }, 1000);
            }
            setForm({
                nombre: "",
                sector: "",
                salida: "",
                llegada: "",
                maquinista: "",
                detalles: ""
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && <Mensajes tipo="bg-red-900">"Existen campos vacíos"</Mensajes>}
            {mensaje && <Mensajes tipo="bg-green-900">"Registro exitoso"</Mensajes>}

            <div>
                <label className='text-gray-700 uppercase font-bold text-sm'>Nombre: </label>
                <input
                    id='nombre'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    type="text"
                    {...register('nombre', {
                        required: true,
                        maxLength: 20,
                        pattern: /^(?!\s*$)[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s!@#$%^&*()_+=[\]{}|;:'",<.>?/~`-]+$/
                    })}
                    
                    value={form.nombre || ""}
                    onChange={handleChange}
                />
                {errors.nombre?.type === 'required' && form.nombre === "" && <small style={{ color: 'red' }}>El campo no puede estar vacio</small>}
                {errors.nombre?.type === 'maxLength' && <small style={{ color: 'red' }}>El máximo de caracteres es 10</small>}
                {errors.nombre?.type === 'pattern' && <small style={{ color: 'red' }}>Solo se permiten letras</small>}
            </div>

            <div>
                <label className='text-gray-700 uppercase font-bold text-sm'>Sector: </label>
                <input
                    id='sector'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    type="text"
                    {...register('sector', {
                        required: true,
                        maxLength: 10,
                        pattern: /^[A-Za-z0-9]+$/
                    })}
                    value={form.sector || ""}
                    onChange={handleChange}
                />
                {errors.sector?.type === 'required' && form.sector === "" && <small style={{ color: 'red' }}>El campo no puede estar vacío</small>}
                {errors.sector?.type === 'maxLength' && <small style={{ color: 'red' }}>El máximo de caracteres es 10</small>}
                {errors.sector?.type === 'pattern' && <small style={{ color: 'red' }}>Solo se permiten letras</small>}
            </div>


            <div>
                <label htmlFor='salida'
                    className='text-gray-700 uppercase font-bold text-sm'>Punto de salida: </label>
                <input
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    type="text"
                    {...register('salida', {
                        required: true,
                        maxLength: 10,
                        pattern: /^[A-Za-z]+$/
                    })}
                    value={form.salida || ""}
                    onChange={handleChange}
                />
                {errors.salida?.type === 'required' && form.salida === "" && <small style={{ color: 'red' }}>El campo no puede estar vacío</small>}
                {errors.salida?.type === 'maxLength' && <small style={{ color: 'red' }}>El máximo de caracteres es 10</small>}
                {errors.salida?.type === 'pattern' && <small style={{ color: 'red' }}>Solo se permiten letras</small>}
            </div>

            <div>
                <label htmlFor='llegada'
                    className='text-gray-700 uppercase font-bold text-sm'>Punto de llegada: </label>
                <input
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    type="text"
                    {...register('llegada', {
                        required: true,
                        maxLength: 10,
                        pattern: /^[A-Za-z]+$/
                    })}
                    value={form.llegada || ""}
                    onChange={handleChange}
                />
                {errors.llegada?.type === 'required' && form.llegada === "" && <small style={{ color: 'red' }}>El campo no puede estar vacio</small>}
                {errors.llegada?.type === 'maxLength' && <small style={{ color: 'red' }}>El máximo de caracteres es 10</small>}
                {errors.llegada?.type === 'pattern' && <small style={{ color: 'red' }}>Solo se permiten letras</small>}
            </div>


            <div>
                <label htmlFor='maquinista'
                    className='text-gray-700 uppercase font-bold text-sm'>NOMBRE DEL MAQUINISTA: </label>
                <input
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    type="text"
                    {...register('maquinista', {
                        required: true,
                        maxLength: 10,
                        pattern: /^[A-Za-z]+$/
                    })}
                    value={form.maquinista || ""}
                    onChange={handleChange}
                />
                {errors.maquinista?.type === 'required' && form.maquinista === "" && <small style={{ color: 'red' }}>El campo no puede estar vacio</small>}
                {errors.maquinista?.type === 'maxLength' && <small style={{ color: 'red' }}>El máximo de caracteres es 10</small>}
                {errors.maquinista?.type === 'pattern' && <small style={{ color: 'red' }}>Solo se permiten letras</small>}
            </div>


            <div>
                <label htmlFor='detalles'
                    className='text-gray-700 uppercase font-bold text-sm'>DETALLES: </label>
                <textarea
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    type="text"
                    {...register('detalles', {
                        required: true,
                        maxLength: 10,
                        pattern: /^[A-Za-z]+$/
                    })}
                    value={form.detalles || ""}
                    onChange={handleChange}
                />
                {errors.detalles?.type === 'required' && form.detalles === "" && <small style={{ color: 'red' }}>El campo no puede estar vacio</small>}
                {errors.detalles?.type === 'maxLength' && <small style={{ color: 'red' }}>El máximo de caracteres es 10</small>}
                {errors.detalles?.type === 'pattern' && <small style={{ color: 'red' }}>Solo se permiten letras</small>}
            </div>

            <input
                type="submit"
                className='bg-sky-900 w-full p-3 
                text-white uppercase font-bold rounded-lg 
                hover:bg-red-900 cursor-pointer transition-all'
                value={form.id ? "Actualizar ruta" : "Registrar ruta"} />

        </form>
    );
}

export default Formulario;
