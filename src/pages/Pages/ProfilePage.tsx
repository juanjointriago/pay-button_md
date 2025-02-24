import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiOutlinePhone } from "react-icons/ai";
import { FaRegAddressCard } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { z } from "zod";
import { useAuthStore } from "../../stores/auth/auth.store";
import { useEffect } from 'react';
import { to } from "../../utils/to";
import API from "../api/api";
import Swal from "sweetalert2";


const signUpSchema = z.object({
  // name: z.string({ message: 'El nombre es obligatorio' }).min(2, { message: 'El nombre es demasiado corto' }),
  // middlename: z.string().min(2, { message: 'El segundo nombre es demasiado corto' }),
  // lastname: z.string().min(2, { message: 'El apellido es demasiado corto' }),
  address: z.string().min(2, { message: 'La calle es demasiado corta' }), // direccion de entrega
  // street2: z.string().min(2, { message: 'La calle es demasiado corta' }), // direccion del cliente
  username: z.string().min(2, { message: 'Campo inválido' }),
  email: z.string().email({ message: 'El email es incorrecto' }),
  phone: z.string().min(2, { message: 'El teléfono es demasiado corto' }),
  password: z.string().trim().optional(),
  postCode: z.string().trim().optional(),
  confirmPassword: z.string().trim().optional(),
})
  .refine((data) => {
    if(data.password?.trim() === '' && data.confirmPassword?.trim() === '') return true;
    return data.password === data.confirmPassword;
  }, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const ProfilePage = () => {
  const user = useAuthStore(state => state.user);
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phone: '',
      postCode: '',
      address: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (!user) return;
    form.setValue('username', user.username);
    form.setValue('email', user.email);
    form.setValue('phone', user.phone);
    form.setValue('postCode', user.postCode);
    form.setValue('address', user.address);
  }, [user]);

  const onSubmit = async (data: any) => {
    data = Object.keys(data).reduce((acc, key) => {
      if (typeof data[key] === 'string' ? !Boolean(data[key].trim()) : !Boolean(data[key])) return acc;
      return { ...acc, [key]: data[key] };
    }, {});

    const [error] =await to(API.put(`users/${user.id}`, data));

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error", // 'Oops...',
        text: "Error al tratar de guardar", // 'Debes seleccionar una sola fila',
        confirmButtonColor: "blue",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Datos guardados correctamente!", // 'Oops...',
      text: "Se enviaron los datos correctamente", // 'Debes seleccionar una sola fila',
      confirmButtonColor: "blue",
    });
  };

  return (
    <div>
      <div className="bg-white rounded-md border border-stroke p-12">
        <h1
          className="text-3xl font-bold text-black dark:text-white sm:text-title-xl2 text-center mb-4"
        >Mi Perfil</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2 gap-x-4">
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Nombre
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                readOnly
                value={user.name}
              />

              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                      fill=""
                    />
                    <path
                      d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Segundo Nombre
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Segundo Nombre"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                readOnly
                value={user.middlename}
              />

              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                      fill=""
                    />
                    <path
                      d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Apellido
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Apellido"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={user.lastname}
              />

              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                      fill=""
                    />
                    <path
                      d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Cédula
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cédula"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onKeyDown={e => {
                  // allow backspace, delete, tab, escape, and enter, arrow keys
                  if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter'
                    || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown'
                  ) return;

                  // dont't allow space
                  if (e.key === ' ') e.preventDefault();

                  // only allow numbers
                  if (!e.key.match(/[0-9]/)) e.preventDefault();
                }}
                readOnly
                value={user.username}
              />
              <span className="absolute right-4 top-4">
                <FaRegAddressCard fontSize={22} opacity={0.5} />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Dirección
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Dirección"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...form.register("address")}
              />
              {
                form.formState.errors.address && form.formState.errors.address.message && (
                  <p className="text-rose-400 text-xs italic">
                    {form.formState.errors.address.message}
                  </p>
                )
              }

              <span className="absolute right-4 top-4">
                <LuMapPin fontSize={22} opacity={0.5} />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Código Postal
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Código Postal"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...form.register("postCode")}
              />
              {
                form.formState.errors.postCode && form.formState.errors.postCode.message && (
                  <p className="text-rose-400 text-xs italic">
                    {form.formState.errors.postCode.message}
                  </p>
                )
              }

              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Correo
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Correo"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...form.register("email")}
              />
              {
                form.formState.errors.email && form.formState.errors.email.message && (
                  <p className="text-rose-400 text-xs italic">
                    {form.formState.errors.email.message}
                  </p>
                )
              }

              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...form.register("phone")}
              />
              {
                form.formState.errors.phone && form.formState.errors.phone.message && (
                  <p className="text-rose-400 text-xs italic">
                    {form.formState.errors.phone.message}
                  </p>
                )
              }

              <span className="absolute right-4 top-4">
                <AiOutlinePhone fontSize={22} opacity={0.5} />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...form.register("password")}
              />
              {
                form.formState.errors.password && form.formState.errors.password.message && (
                  <p className="text-rose-400 text-xs italic">
                    {form.formState.errors.password.message}
                  </p>
                )
              }

              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                      fill=""
                    />
                    <path
                      d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...form.register("confirmPassword")}
              />
              {
                form.formState.errors.confirmPassword && form.formState.errors.confirmPassword.message && (
                  <p className="text-rose-400 text-xs italic">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )
              }

              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                      fill=""
                    />
                    <path
                      d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-5 col-span-2 max-w-[300px] mx-auto w-[50%]">
            <button
              type="submit"
              value="Actualizar mis datos"
              disabled={form.formState.isSubmitting}
              className={
                `w-full cursor-pointer rounded-lg border bg-primary p-4 text-white transition hover:bg-opacity-90 font-semibold
                             disabled:bg-primary disabled:text-white disabled:bg-opacity-70 disabled:cursor-default`
              }
            >
              {
                form.formState.isSubmitting
                  ? <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-t-transparent mx-auto" />
                  : 'Actualizar mis datos'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};
