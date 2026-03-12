import { IOCSource, IOCType } from '@/enums'

export const IOC_TYPE_OPTIONS: { value: IOCType; labelKey: string }[] = [
  { value: IOCType.IP, labelKey: 'search.typeIP' },
  { value: IOCType.DOMAIN, labelKey: 'search.typeDomain' },
  { value: IOCType.URL, labelKey: 'search.typeURL' },
  { value: IOCType.MD5, labelKey: 'search.typeMd5' },
  { value: IOCType.SHA1, labelKey: 'search.typeSha1' },
  { value: IOCType.SHA256, labelKey: 'search.typeSha256' },
  { value: IOCType.HASH, labelKey: 'search.typeHash' },
  { value: IOCType.FILENAME, labelKey: 'search.typeFilename' },
  { value: IOCType.CIDR, labelKey: 'search.typeCidr' },
  { value: IOCType.EMAIL, labelKey: 'search.typeEmail' },
  { value: IOCType.ASN, labelKey: 'search.typeAsn' },
  { value: IOCType.CVE, labelKey: 'search.typeCve' },
  { value: IOCType.REGISTRY, labelKey: 'search.typeRegistry' },
  { value: IOCType.FILEPATH, labelKey: 'search.typeFilepath' },
]

export const IOC_SOURCE_OPTIONS: { value: IOCSource; labelKey: string }[] = [
  { value: IOCSource.MISP, labelKey: 'search.sourceMisp' },
  { value: IOCSource.WAZUH, labelKey: 'search.sourceWazuh' },
  { value: IOCSource.MANUAL, labelKey: 'search.sourceManual' },
  { value: IOCSource.THREATFOX, labelKey: 'search.sourceThreatfox' },
  { value: IOCSource.OTX, labelKey: 'search.sourceOtx' },
  { value: IOCSource.VIRUSTOTAL, labelKey: 'search.sourceVirustotal' },
  { value: IOCSource.LOGSTASH, labelKey: 'search.sourceLogstash' },
]
