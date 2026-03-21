'use client'

import { User, Lock, Mail, Shield, Building2, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { PageHeader, LoadingSpinner } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProfilePage } from '@/hooks/useProfilePage'

export default function ProfilePage() {
  const {
    t,
    tRoles,
    isLoading,
    name,
    setName,
    namePassword,
    setNamePassword,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNamePassword,
    setShowNamePassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    toggleVisibility,
    displayEmail,
    displayTenant,
    roleLabelKey,
    updateProfilePending,
    changePasswordPending,
    handleUpdateName,
    handleChangePassword,
    canEditProfile,
  } = useProfilePage()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PageHeader title={t('title')} description={t('description')} />

      {/* Personal Information Card */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('personalInfo')}
                </span>
                <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5" />
                    {t('email')}
                  </Label>
                  <p className="text-foreground text-sm font-medium">{displayEmail}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Shield className="h-3.5 w-3.5" />
                    {t('role')}
                  </Label>
                  <p className="text-foreground text-sm font-medium">
                    {roleLabelKey ? tRoles(roleLabelKey) : '-'}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Building2 className="h-3.5 w-3.5" />
                    {t('tenant')}
                  </Label>
                  <p className="text-foreground text-sm font-medium">{displayTenant || '-'}</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Update Name Card */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('updateName')}
                </span>
                <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">{t('name')}</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={e => setName(e.currentTarget.value)}
                    placeholder={t('namePlaceholder')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-name-password">{t('confirmPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="profile-name-password"
                      type={showNamePassword ? 'text' : 'password'}
                      value={namePassword}
                      onChange={e => setNamePassword(e.currentTarget.value)}
                      placeholder={t('confirmPasswordPlaceholder')}
                      className="pe-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility(setShowNamePassword)}
                      className="text-muted-foreground hover:text-foreground absolute end-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showNamePassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={
                    !canEditProfile || updateProfilePending || !name.trim() || !namePassword
                  }
                >
                  {updateProfilePending ? t('updating') : t('updateName')}
                </Button>
              </form>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Change Password Card */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t('changePassword')}
                </span>
                <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t('currentPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.currentTarget.value)}
                      placeholder={t('currentPasswordPlaceholder')}
                      className="pe-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility(setShowCurrentPassword)}
                      className="text-muted-foreground hover:text-foreground absolute end-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('newPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.currentTarget.value)}
                      placeholder={t('newPasswordPlaceholder')}
                      className="pe-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility(setShowNewPassword)}
                      className="text-muted-foreground hover:text-foreground absolute end-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">{t('confirmNewPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="confirm-new-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.currentTarget.value)}
                      placeholder={t('confirmNewPasswordPlaceholder')}
                      className="pe-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility(setShowConfirmPassword)}
                      className="text-muted-foreground hover:text-foreground absolute end-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={
                    !canEditProfile ||
                    changePasswordPending ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                >
                  {changePasswordPending ? t('changingPassword') : t('changePassword')}
                </Button>
              </form>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
