'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
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
import { useCheckEmail } from '@/hooks/useAdmin'
import { useDebounce } from '@/hooks/useDebounce'
import type { AssignUserInput } from '@/types'

const assignUserSchema = z.object({
  email: z.string().email(),
  role: z.string().min(1),
  name: z.string().max(255),
  password: z.string().max(128),
})

type AssignUserFormValues = z.infer<typeof assignUserSchema>

export type { AssignUserFormValues }

interface AssignUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AssignUserInput) => void
  loading: boolean
  tenantId: string
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

export function AssignUserDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  tenantId,
  callerRole,
}: AssignUserDialogProps) {
  const t = useTranslations('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const debouncedEmail = useDebounce(emailInput, 400)

  const { data: checkResult, isFetching: isCheckingEmail } = useCheckEmail(tenantId, debouncedEmail)

  const emailCheck = checkResult?.data ?? null
  const userExists = emailCheck?.exists === true
  const alreadyInTenant = emailCheck?.alreadyInTenant === true
  const isNewUser = emailCheck !== null && !userExists

  const availableRoles =
    callerRole === UserRole.GLOBAL_ADMIN
      ? ROLE_OPTIONS
      : ROLE_OPTIONS.filter(option => option.value !== UserRole.GLOBAL_ADMIN)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AssignUserFormValues>({
    resolver: zodResolver(assignUserSchema),
    defaultValues: {
      email: '',
      role: '',
      name: '',
      password: '',
    },
  })

  // Pre-fill name when existing user is found
  useEffect(() => {
    if (userExists && emailCheck?.user) {
      setValue('name', emailCheck.user.name)
    } else if (isNewUser) {
      setValue('name', '')
    }
  }, [userExists, isNewUser, emailCheck?.user, setValue])

  function handleFormSubmit(values: AssignUserFormValues) {
    const data: AssignUserInput = {
      email: values.email,
      role: values.role,
    }

    if (isNewUser && values.name) {
      data.name = values.name
    }
    if (isNewUser && values.password) {
      data.password = values.password
    }

    setEmailInput('')
    setShowPassword(false)
    reset()
    onSubmit(data)
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      reset()
      setEmailInput('')
      setShowPassword(false)
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('users.assignUser')}</DialogTitle>
          <DialogDescription>{t('users.assignUserDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assign-email">{t('users.userEmail')}</Label>
            <div className="relative">
              <Input
                id="assign-email"
                type="email"
                {...register('email', {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmailInput(e.target.value),
                })}
                placeholder={t('users.userEmailPlaceholder')}
                className="pe-10"
              />
              {isCheckingEmail && (
                <div className="absolute end-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                </div>
              )}
              {userExists && !alreadyInTenant && (
                <div className="absolute end-3 top-1/2 -translate-y-1/2">
                  <Check className="text-status-success h-4 w-4" />
                </div>
              )}
            </div>
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}

            {userExists && !alreadyInTenant && emailCheck?.user && (
              <div className="bg-status-success border-status-success flex items-center gap-2 rounded-lg border p-2.5">
                <Check className="text-status-success h-3.5 w-3.5 shrink-0" />
                <p className="text-status-success text-xs font-medium">
                  {t('users.existingUserFound', { name: emailCheck.user.name })}
                </p>
              </div>
            )}

            {alreadyInTenant && (
              <div className="bg-status-warning border-status-warning flex items-center gap-2 rounded-lg border p-2.5">
                <AlertCircle className="text-status-warning h-3.5 w-3.5 shrink-0" />
                <p className="text-status-warning text-xs font-medium">
                  {t('users.userAlreadyInTenant')}
                </p>
              </div>
            )}

            {isNewUser && (
              <div className="bg-status-info border-status-info flex items-center gap-2 rounded-lg border p-2.5">
                <AlertCircle className="text-status-info h-3.5 w-3.5 shrink-0" />
                <p className="text-status-info text-xs font-medium">
                  {t('users.newUserWillBeCreated')}
                </p>
              </div>
            )}
          </div>

          {isNewUser && (
            <div className="space-y-2">
              <Label htmlFor="assign-name">{t('users.userName')}</Label>
              <Input
                id="assign-name"
                {...register('name')}
                placeholder={t('users.userNamePlaceholder')}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>
          )}

          {isNewUser && (
            <div className="space-y-2">
              <Label htmlFor="assign-password">{t('users.userPassword')}</Label>
              <div className="relative">
                <Input
                  id="assign-password"
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
          )}

          <div className="space-y-2">
            <Label htmlFor="assign-role">{t('users.userRole')}</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="assign-role" className="w-full">
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
            <Button type="submit" disabled={loading || alreadyInTenant}>
              {loading ? t('users.assigning') : t('users.assignUser')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
