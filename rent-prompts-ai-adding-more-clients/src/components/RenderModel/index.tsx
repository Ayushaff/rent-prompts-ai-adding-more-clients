import { Model } from '@/payload-types'
import { Box, ChevronDown, ChevronRight } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import RichText from '../RichText'

export const RenderModel: React.FC<{ data: any; id: string }> = ({ data, id }) => {
  const model = data as Model
  const [selectedKey, setSelectedKey] = useState<string>('prod')
  const [formData, setFormData] = useState<any>({
    prompt: '',
    keyToUse: 'prod',
    systemprompt: '',
    negativeprompt: '',
    image: '',
    settings: { streaming: true },
  })
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const [apiResult, setApiResult] = useState<any>(null) // State for API response
  const [error, setError] = useState<string | null>(null) // State for error handling

  if (!model) {
    return <div>Error: Model data is missing.</div>
  }

  const toggleAccordion = () => setSettingsOpen(!isSettingsOpen)

  const handleSelect = (value: string) => {
    setSelectedKey(value)
    setFormData((prev) => ({ ...prev, keyToUse: value }))
  }

  const handleSettingChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    const isChecked = type === 'checkbox' && (event.target as HTMLInputElement).checked

    const updatedValue =
      type === 'checkbox'
        ? isChecked
        : type === 'number' && !isNaN(Number(value))
          ? Number(value)
          : value

    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: updatedValue,
      },
    }))
  }

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/models/testModel/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('API call failed')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error)
      }
      setApiResult(result.data.result)
    } catch (error) {
      console.error('Error in Running Model', error.message)
      setError('An error occurred while running the model.') // Set error message
    }
  }

  return (
    <form className="text-white p-6" onSubmit={handleSubmit}>
      <div className="bg-indigo-600 h-fit min-h-96 border-4 border-muted-foreground text-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-start gap-4 items-center mb-4 px-4">
          <Box className="p-0" width={50} height={50} />
          <div>
            <h2 className="text-xl font-bold">{model.name}</h2>
            <p>{model.description}</p>
          </div>
        </div>
        {/* <RichText content={model.about} /> */}
        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handlePromptChange}
          />
        </div>
        {model.systemprompt && (
          <div>
            <Label htmlFor="systemprompt">System Prompt</Label>
            <Textarea
              id="systemprompt"
              name="systemprompt"
              value={formData.systemprompt}
              onChange={handlePromptChange}
            />
          </div>
        )}
        {model.negativeprompt && (
          <div>
            <Label htmlFor="negativeprompt">Negative Prompt</Label>
            <Textarea
              id="negativeprompt"
              name="negativeprompt"
              value={formData.negativeprompt}
              onChange={handlePromptChange}
            />
          </div>
        )}
        <div>
          <Label>Choose keys to test on</Label>
          <div className="flex gap-4 mt-2">
            <div
              className={`cursor-pointer border rounded-lg px-4 py-3 ${
                selectedKey === 'prod'
                  ? 'border-2 border-white bg-indigo-900'
                  : 'border-2 border-muted-foreground bg-indigo-600'
              }`}
              onClick={() => handleSelect('prod')}
            >
              <input
                type="radio"
                name="keys"
                id="prod"
                value="prod"
                checked={selectedKey === 'prod'}
                onChange={() => handleSelect('prod')}
                className="hidden"
              />
              <label htmlFor="prod">Prod</label>
            </div>
            <div
              className={`cursor-pointer border rounded-lg px-4 py-3 ${
                selectedKey === 'test'
                  ? 'border-2 border-white bg-indigo-900'
                  : 'border-2 border-muted-foreground bg-indigo-600'
              }`}
              onClick={() => handleSelect('test')}
            >
              <input
                type="radio"
                name="keys"
                id="test"
                value="test"
                checked={selectedKey === 'test'}
                onChange={() => handleSelect('test')}
                className="hidden"
              />
              <label htmlFor="test">Test</label>
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="flex justify-between items-center w-full text-lg font-semibold bg-indigo-700 py-3 px-4 rounded-t-lg mt-4"
            onClick={toggleAccordion}
          >
            Advance Settings:
            {isSettingsOpen ? <ChevronDown className="ml-2" /> : <ChevronRight className="ml-2" />}
          </button>
          {isSettingsOpen && (
            <div className="bg-indigo-700 p-4 rounded-b-lg pt-1">
              {model.settings.map((setting) => (
                <div key={setting.name}>
                  <Label>{setting.name}</Label>
                  {setting.type === 'boolean' ? (
                    <Input
                      type="checkbox"
                      name={setting.name}
                      checked={formData.settings[setting.name] || false}
                      onChange={handleSettingChange}
                    />
                  ) : setting.type === 'integer' ? (
                    <Input
                      type="number"
                      name={setting.name}
                      value={formData.settings[setting.name] || ''}
                      onChange={handleSettingChange}
                      step={undefined}
                    />
                  ) : setting.type === 'select' ? (
                    <Input
                      type=""
                      name={setting.name}
                      value={formData.settings[setting.name] || ''}
                      onChange={handleSettingChange}
                      step={undefined}
                    />
                  ) : setting.type === 'string' ? (
                    <Input
                      type="text"
                      name={setting.name}
                      value={formData.settings[setting.name] || ''}
                      onChange={handleSettingChange}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Output Section */}
        {error && <div className="text-red-500 mt-4">{error}</div>} {/* Error message */}
        {apiResult && (
          <div className="mt-4 p-4 border border-gray-700 bg-indigo-800 rounded h-96 overflow-y-auto whitespace-nowrap">
            <h3 className="font-bold">Output Section:</h3>
            <p>{apiResult}</p>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button type="submit" variant="blue">
            Run
          </Button>
        </div>
      </div>
    </form>
  )
}
