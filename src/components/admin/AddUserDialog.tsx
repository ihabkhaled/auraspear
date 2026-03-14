'use client'

import { useState } from 'react'
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

interface AddUserFormValues {
  name: string
  email: string
  password: string
  role: string
}

export type { AddUserFormValues }

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: AddUserFormValues) => void
  loading: boolean
  callerRole?: UserRole | undefined
}

const ROLE_OPTIONS = [
  { value: UserRole.GLOBAL_ADMIN, labelKey: 'roles.globalAdmin' },
  { value: UserRole.TENANT_ADMIN, labelKey: 'roles.tenantAdmin' },
  { value: UserRole.SOC_ANALYST_L2, labelKey: 'roles.socAnalystL2' },
  { value: UserRole.SOC_ANALYST_L1, labelKey: 'roles.socAnalystL1' },
  { value: UserRole.THREAT_HUNTER, labelKey: 'roles.threatHunter' },
  { value: UserRole.EXECUTIVE_READONLY, labelKey: 'roles.executiveReadonly' },
] as const

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  callerRole,
}: AddUserDialogProps) {
  const t = useTranslations('admin')
  const tValidation = useTranslations('errors.validation')
  const [showPassword, setShowPassword] = useState(false)

  const availableRoles =
    callerRole === UserRole.GLOBAL_ADMIN
      ? ROLE_OPTIONS
      : ROLE_OPTIONS.filter(option => option.value !== UserRole.GLOBAL_ADMIN)

  const schema = z.object({
    name: z.string().min(1, tValidation('name.required')).max(255),
    email: z
      .string()
      .min(1, tValidation('email.required'))
      .email(tValidation('email.invalidEmail')),
    password: z.string().min(8, tValidation('newPassword.tooShort')).max(128),
    role: z.string().min(1, tValidation('role.required')),
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
  })

  function handleFormSubmit(values: AddUserFormValues) {
    setShowPassword(false)
    reset()
    onSubmit(values)
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
          <DialogTitle>{t('users.addUser')}</DialogTitle>
          <DialogDescription>{t('users.addUserDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">{t('users.userName')}</Label>
            <Input
              id="user-name"
              {...register('name')}
              placeholder={t('users.userNamePlaceholder')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">{t('users.userEmail')}</Label>
            <Input
              id="user-email"
              type="email"
              {...register('email')}
              placeholder={t('users.userEmailPlaceholder')}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password">{t('users.userPassword')}</Label>
            <div className="relative">
              <Input
                id="user-password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={t('users.userPasswordPlaceholder')}
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
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-role">{t('users.userRole')}</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="user-role" className="w-full">
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
              {loading ? t('users.creating') : t('users.addUser')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
