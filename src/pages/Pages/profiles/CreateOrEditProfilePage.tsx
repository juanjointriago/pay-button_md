import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProfileStore } from "../../../stores/profile/profile.store";
import { useState, useEffect, useRef, useMemo } from "react";
import { to } from "../../../utils/to";
import API from "../../api/api";
import { AxiosResponse } from "axios";
import { ScreenLoader } from "../../../components/shared/ScreenLoader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  features: z.array(z.object({
    id: z.number(),
    name: z.string().min(3),
    description: z.string().min(3),
    isChecked: z.boolean(),
    roles: z.array(z.object({
      id: z.number(),
      name: z.string().min(3),
      description: z.string().min(3),
      isChecked: z.boolean(),
    }))
  })),
});

type FormValues = z.infer<typeof schema>;

interface DataRole {
  id: number,
  name: string,
  description: string
  roles: {
    id: number,
    name: string,
    description: string
  }[]
}

export const CreateOrEditProfilePage = () => {
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      name: selectedProfile?.name || '',
    },
    resolver: zodResolver(schema),
  });

  const [dataRoles, setDataRoles] = useState<DataRole[]>([]);

  const getDataRoles = async () => {
    setIsLoading(true);
    const [error, response] = await to<AxiosResponse<DataRole[]>>(API.get('entityWithRoles'));
    if (error) return setIsLoading(false);
    setDataRoles(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getDataRoles();
  }, []);

  const displayFeatures = useMemo(() => dataRoles.map(feature => {
    if (!selectedProfile) return { ...feature, isChecked: false, roles: feature.roles.map(rol => ({ ...rol, isChecked: false })) };

    // valid sub-roles
    const foundProfile = selectedProfile.entities.find(f => f.id === feature.id);
    if (foundProfile) {
      feature.roles = feature.roles.map(action => {
        const foundAction = foundProfile.roles.find(a => a.id === action.id);
        if (foundAction) return { ...action, isChecked: true };
        return { ...action, isChecked: false };
      });
    } else {
      feature.roles = feature.roles.map(action => {
        return { ...action, isChecked: false };
      });
    }

    if (feature.roles.every(action => (action as any).isChecked)) return { ...feature, isChecked: true };

    return { ...feature, isChecked: false };
  }), [selectedProfile, dataRoles]);

  const onSubmit = async (data: FormValues) => {
    const roleIds = data.features.reduce((acc, feature) => {
      if (feature.isChecked) return [...acc, ...feature.roles.map(action => action.id)];

      const checkedRoles = feature.roles.filter(action => action.isChecked);
      return [...acc, ...checkedRoles.map(action => action.id)];
    }, []);

    if (!!selectedProfile) {
      const [error] = await to(API.put(`profiles/${selectedProfile.id}`, { roleIds, name: data.name }));
      if (error) return Swal.fire({ icon: 'error', title: 'Error', text: 'Error al actualizar el perfil' });
      const res = await Swal.fire({ icon: 'success', title: 'Perfil actualizado', text: 'Perfil actualizado correctamente' });
      if (res.dismiss || res.isConfirmed) navigate('/home/profiles');
    } else {
      const [error] = await to(API.post('profiles', { roleIds, name: data.name }));
      if (error) return Swal.fire({ icon: 'error', title: 'Error', text: 'Error al crear el perfil' });
      const res = await Swal.fire({ icon: 'success', title: 'Perfil creado', text: 'Perfil creado correctamente' });
      if (res.dismiss || res.isConfirmed) navigate('/home/profiles');
    }
  };

  useEffect(() => {
    form.setValue('features', displayFeatures);
  }, [displayFeatures]);

  return (
    <div>
      <ScreenLoader isLoading={isLoading} />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <label>
          Nombre del perfil:
          <input type="text" placeholder="Ej. Admin" className="w-full h-10 p-2 rounded-md dark:border-white focus:outline-none focus:border-black dark:focus:border-white my-2"
            {...form.register('name')}
          />
          {
            form.formState.errors.name && form.formState.touchedFields.name
              ? <p className="text-red-500 text-xs italic">
                {form.formState.errors.name.message}
              </p>
              : null
          }
        </label>
        {/* Divider */}
        <div className="w-full border-t-[1px] border-t-slate-400 mt-1 mb-4" />

        <p
          className="text-title-sm font-bold text-black dark:text-white mb-4"
        >Permisos</p>

        {
          displayFeatures.map(feature => (
            <div key={feature.id}>
              <CheckBoxGroup
                feature={feature}
                onChange={feature => {
                  const oldFeatures = form.getValues('features') || [];
                  form.setValue('features', oldFeatures.map(f => f.id === feature.id ? feature : f));

                  // form.setValue('features', [...oldFeatures, feature]);
                }}
              />
              <div className="border-t-[1px] border-t-slate-400/50 mt-1 mb-4" />
            </div>
          ))
        }

        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 font-medium text-white hover:bg-opacity-90 flex items-center gap-2 ml-auto mt-10"
        >
          {
            form.formState.isSubmitting
              ? <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-t-transparent mx-auto" />
              : 'Guardar cambios'
          }
        </button>
      </form>
    </div>
  )
};



interface CheckBoxGroupProps {
  feature: {
    id: number;
    name: string;
    description: string;
    isChecked?: boolean;
    roles: {
      id: number;
      name: string;
      description: string;
      isChecked?: boolean;
    }[];
  }
  onChange?: (feature: any) => void;
}

const CheckBoxGroup = ({ feature, onChange }: CheckBoxGroupProps) => {
  const [isCheckedMainRole, setIsCheckedMainRole] = useState(feature.isChecked);
  const [childrenRoles, setChildrenRoles] = useState(feature.roles);
  const hasInteraction = useRef(false);

  useEffect(() => {
    const allChecked = childrenRoles.every(action => action.isChecked);
    setIsCheckedMainRole(allChecked);
  }, [childrenRoles]);

  // useEffect(() => {
  //   if (!onChange || !hasInteraction.current) return;
  //   onChange({ ...feature, isChecked: isCheckedMainRole });
  // }, [isCheckedMainRole]);

  useEffect(() => {
    if (!onChange || !hasInteraction.current) return;
    onChange({ ...feature, roles: childrenRoles, isChecked: childrenRoles.every(action => action.isChecked) });
  }, [childrenRoles]);

  return (
    <>
      <label className="flex gap-2 cursor-pointer max-w-fit items-center">
        <input
          name={feature.name}
          type="checkbox"
          className="cursor-pointer w-4 h-4"
          checked={isCheckedMainRole}
          onChange={() => {
            setChildrenRoles(state => state.map(action => ({ ...action, isChecked: !isCheckedMainRole })));
            setIsCheckedMainRole(state => !state);
            hasInteraction.current = true;
          }}
        />
        <p className="font-medium text-black text-lg">{feature.description}</p>
      </label>


      <div className="flex gap-x-4 pl-8">
        {
          childrenRoles.map(action => (
            <label className="flex gap-2 cursor-pointer max-w-fit items-center mt-2" key={action.id}>
              <input
                type="checkbox"
                placeholder="Descripción"
                className="cursor-pointer w-4 h-4"
                checked={action.isChecked}
                onChange={() => {
                  setChildrenRoles(state => state.map(a => a.id === action.id ? { ...a, isChecked: !a.isChecked } : a));
                  hasInteraction.current = true;
                }}
              />
              <p className="text-black text-lg">{action.description}</p>
            </label>
          ))
        }
      </div>
    </>
  )
};


