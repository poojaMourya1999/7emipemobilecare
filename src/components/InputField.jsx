// components/InputField.jsx
const InputField = ({ label, name, type = 'text', value, onChange }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        required
      />
    </div>
  );
};

export default InputField;
