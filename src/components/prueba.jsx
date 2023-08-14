import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { useAlert } from 'react-alert';

const Formulario = ({ setEstado, idMetro }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const alert = useAlert();

    const [error, setError] = useState(false);
    const [mensaje, setMensaje] = useState(false);
    const [metroBd, setMetroBd] = useState([]);
    const [recargar, setRecargar] = useState(false);
    const [validation, setValidation] = useState(false);

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
            setTimeout(() => {
                window.location.reload(); // Recargar la página después de mostrar la alerta
            }, 2000);
        }
    }, [recargar])

    useEffect(() => {
        if (idMetro) {
            (async function () {
                try {
                    const respuesta = await fetch(`https://64d01a7dffcda80aff526884.mockapi.io/metro/${idMetro}`);
                    const data = await respuesta.json();
                    setForm(data);
                    setMetroBd([data]); // Convertir el objeto de respuesta en un array
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

        try {
            if (form.id) {
                setValidation(false); // Restaurar la validación antes de la operación de actualización
                console.log("SOY METRO", metroBd)
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
                    alert.show('El registro se actualizó con éxito :3'); // Mostrar alerta
                    setRecargar(true);
                    setEstado(false);
                }, 1000);
            } else {
                const url = "https://64d01a7dffcda80aff526884.mockapi.io/metro/";
                form.id = uuidv4();
                await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(form).trim(),
                    headers: { 'Content-Type': 'application/json' }
                });
                setMensaje(true);
                setEstado(true);
                setTimeout(() => {
                    setMensaje(false);
                    setEstado(false);
                    alert.show('Registro exitoso'); // Mostrar alerta
                    setRecargar(true);
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
            <div>
                <label className='text-gray-700 uppercase font-bold text-sm'>Nombre: </label>
                <input
                    id='nombre'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    type="text"
                    {...register('nombre', {
                        required: true,
                        maxLength: 25,
                        value: form.nombre?.trim() || ''
                    })}
                />
                {errors.nombre?.type === 'required' && form.nombre === "" && <small style={{ color: 'red' }}>El campo no puede estar vacío</small>}
                {errors.nombre?.type === 'maxLength' && <small style={{ color: 'red' }}>El máximo de caracteres es 25</small>}
                {metroBd.map((element) => element.nombre === form.nombre) ? <small style={{ color: 'red' }}>El nombre de la ruta no puede repetirse</small> : null}
            </div>
            {/* Resto del formulario... */}
        </form>
    );
}

export default Formulario;
