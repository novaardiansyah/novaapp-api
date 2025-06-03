import { DateTime, DurationLikeObject } from 'luxon'

export function getTimes(
  plusObj?: DurationLikeObject,
  format: string = "yyyy-MM-dd HH:mm:ss",
  zone: string = "Asia/Jakarta"
) {
  if (!plusObj) return DateTime.now().setZone(zone).toFormat(format)
  return DateTime.now().setZone(zone).plus(plusObj).toFormat(format)
}