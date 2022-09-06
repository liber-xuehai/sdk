type Q<T> = (this:T, ...args: any) => any
export type Methods<T> = {
	[P in keyof T]: T[P] extends Q<T> ? P : never
}[keyof T]