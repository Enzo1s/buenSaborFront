import * as Yup from 'yup';

export const DomicilioValidationSchema = Yup.object().shape({
    calle: Yup.string().required('La calle es requerida'),
    numero: Yup.number().required('El número es requerido').positive('Debe ser un número positivo'),
    cp: Yup.number().required('El código postal es requerido').positive('Debe ser un número positivo'),
    localidad: Yup.string().required('La localidad es requerida'),
});

export const SucursalEmpresaValidationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre de la sucursal es requerido'),
    horarioApertura: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)')
        .required('Horario de apertura requerido'),
    horarioCierre: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)')
        .required('Horario de cierre requerido')
        .test(
            'is-after-apertura',
            'El horario de cierre debe ser posterior al de apertura',
            function (horarioCierre) {
                const { horarioApertura } = this.parent;
                if (!horarioApertura || !horarioCierre) return true;
                const [hA, mA] = horarioApertura.split(':').map(Number);
                const [hC, mC] = horarioCierre.split(':').map(Number);
                const aperturaEnMinutos = hA * 60 + mA;
                const cierreEnMinutos = hC * 60 + mC;
                return cierreEnMinutos > aperturaEnMinutos;
            }
        ),
    domicilio: DomicilioValidationSchema.required('El domicilio de la sucursal es requerido'),
});

export const EmpresaValidationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es requerido'),
    razonSocial: Yup.string().required('La razón social es requerida'),
    cuil: Yup.number()
        .required('El CUIL es requerido')
        .integer('El CUIL debe ser un número entero')
        .positive('El CUIL debe ser un número positivo')
        .test(
            'len',
            'El CUIL debe tener 11 dígitos',
            (val) => Boolean(val && val.toString().length === 11)
        ),
    sucursalEmpresa: Yup.array()
        .of(SucursalEmpresaValidationSchema)
        .min(1, 'Debe haber al menos una sucursal')
        .required('Las sucursales son requeridas'),
});