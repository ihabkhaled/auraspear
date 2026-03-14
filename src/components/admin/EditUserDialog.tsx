'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@/enums'
import type { TenantUser } from '@/types'

const editUserSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1),
  password: z.string().max(128).optional().or(z.literal('')),
})

type EditUserFormValues = z.infer<typeof editUserSchema>

export type { EditUserFormValues }

const ROLE_OPTIONS = [
  { value: UserRole.GLOBAL_ADMIN, labelKey: 'roles.globalAdmin' },
  { value: UserRole.TENANT_ADMIN, labelKey: 'roles.tenantAdmin' },
  { value: UserRole.SOC_ANALYST_L2, labelKey: 'roles.socAnalystL2' },
  { value: UserRole.SOC_ANALYST_L1, labelKey: 'roles.socAnalystL1' },
  { value: UserRole.THREAT_HUNTER, labelKey: 'roles.threatHunter' },
  { value: UserRole.EXECUTIVE_READONLY, labelKey: 'roles.executiveReadonly' },
] as const

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: TenantUser | null
  onSubmit: (data: { name: string; role: string; password?: string }) => void
  loading: boolean
  callerRole?: UserRole | undefined
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  loading,
  callerRole,
}: EditUserDialogProps) {
  const t = useTranslations('admin')
  const [showPassword, setShowPassword] = useState(false)

  const availableRoles =
    callerRole === UserRole.GLOBAL_ADMIN
      ? ROLE_OPTIONS
      : ROLE_OPTIONS.filter(option => option.value !== UserRole.GLOBAL_ADMIN)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      role: '',
      password: '',
    },
  })

  // Populate form when dialog opens with user data
  useEffect(() => {
    if (open && user) {
      reset({ name: user.name, role: user.role, password: '' })
    }
  }, [open, user, reset])

  function handleFormSubmit(values: EditUserFormValues) {
    const payload: { name: string; role: string; password?: string } = {
      name: values.name,
      role: values.role,
    }
    if (values.password && values.password.length > 0) {
      payload.password = values.password
    }
    setShowPassword(false)
    reset()
    onSubmit(payload)
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      reset()
      setShowPassword(false)
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('users.editUser')}</DialogTitle>
          <DialogDescription>{t('users.editUserDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user-name">{t('users.userName')}</Label>
            <Input
              id="edit-user-name"
              {...register('name')}
              placeholder={t('users.userNamePlaceholder')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('users.email')}</Label>
            <p className="text-muted-foreground text-sm">{user?.email ?? ''}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-user-password">{t('users.userPassword')}</Label>
            <div className="relative">
              <Input
                id="edit-user-password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={t('users.passwordPlaceholder')}
                className="pe-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">{t('users.passwordOptional')}</p>
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-user-role">{t('users.userRole')}</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="edit-user-role" className="w-full">
                    <SelectValue placeholder={t('users.userRolePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
