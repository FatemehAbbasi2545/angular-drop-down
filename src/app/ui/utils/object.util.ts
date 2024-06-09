export class ObjectUtil {
    public static accessPropertyValue(obj: any, key: keyof typeof obj) {
        return obj && key && obj[key] ? obj[key] : null;
    };

    public static equals(obj1: any, obj2: any, field?: string): boolean {
        if (field) return ObjectUtil.resolveFieldData(obj1, field) === this.resolveFieldData(obj2, field);
        else return ObjectUtil.equalsByValue(obj1, obj2);
    }

    public static resolveFieldData(data: any, field: any): any {
        if (data && field) {
            if (this.isFunction(field)) {
                return field(data);
            } else if (field.indexOf('.') == -1) {
                return data[field];
            } else {
                let fields: string[] = field.split('.');
                let value = data;
                for (let i = 0, len = fields.length; i < len; ++i) {
                    if (value == null) {
                        return null;
                    }
                    value = value[fields[i]];
                }
                return value;
            }
        } else {
            return null;
        }
    }


    public static equalsByValue(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) return true;

        if (obj1 && obj2 && typeof obj1 == 'object' && typeof obj2 == 'object') {
            var arrA = Array.isArray(obj1),
                arrB = Array.isArray(obj2),
                i,
                length,
                key;

            if (arrA && arrB) {
                length = obj1.length;
                if (length != obj2.length) return false;
                for (i = length; i-- !== 0; ) if (!this.equalsByValue(obj1[i], obj2[i])) return false;
                return true;
            }

            if (arrA != arrB) return false;

            var dateA = this.isDate(obj1),
                dateB = this.isDate(obj2);
            if (dateA != dateB) return false;
            if (dateA && dateB) return obj1.getTime() == obj2.getTime();

            var regexpA = obj1 instanceof RegExp,
                regexpB = obj2 instanceof RegExp;
            if (regexpA != regexpB) return false;
            if (regexpA && regexpB) return obj1.toString() == obj2.toString();

            var keys = Object.keys(obj1);
            length = keys.length;

            if (length !== Object.keys(obj2).length) return false;

            for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(obj2, keys[i])) return false;

            for (i = length; i-- !== 0; ) {
                key = keys[i];
                if (!this.equalsByValue(obj1[key], obj2[key])) return false;
            }

            return true;
        }

        return obj1 !== obj1 && obj2 !== obj2;
    }

    public static isFunction(obj: any) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    public static isDate(input: any) {
        return Object.prototype.toString.call(input) === '[object Date]';
    }
}