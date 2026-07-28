"use client"

import { useState, useEffect } from "react"
import { Search, Plus, UserPlus, Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "@/actions/customers"

export default function CustomersPage() {
  const [search, setSearch] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    fullAddress: ""
  })

  async function loadCustomers() {
    setLoading(true)
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error("Failed to load customers", err)
      toast.error("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.includes(search)
  )

  const openAddModal = () => {
    setEditingCustomerId(null)
    setFormData({ name: "", email: "", contact: "", fullAddress: "" })
    setIsModalOpen(true)
  }

  const openEditModal = (customer: any) => {
    setEditingCustomerId(customer.id)
    setFormData({
      name: customer.name,
      email: customer.email,
      contact: customer.contact,
      fullAddress: customer.address !== "No Address" ? customer.address : ""
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return
    try {
      const res = await deleteCustomer(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Customer deleted successfully")
        loadCustomers()
      }
    } catch (err) {
      toast.error("Failed to delete customer")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = editingCustomerId 
        ? await updateCustomer(editingCustomerId, formData)
        : await addCustomer(formData)

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(editingCustomerId ? "Customer updated successfully!" : "Customer added successfully!")
        setIsModalOpen(false)
        loadCustomers()
        setFormData({ name: "", email: "", contact: "", fullAddress: "" })
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your customer database and view contact details.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Customer
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCustomerId ? "Edit Customer" : "Add New Customer"}</DialogTitle>
              <DialogDescription>
                {editingCustomerId ? "Update the details for this customer below." : "Enter the details for the new customer. A default account will be created."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input id="contact" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>


              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address *</Label>
                <Input id="fullAddress" required value={formData.fullAddress} onChange={e => setFormData({...formData, fullAddress: e.target.value})} />
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Customer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-panel border-border/50 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search customers..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No customers found.</div>
          ) : (
            <div className="w-full">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer Details</th>
                    <th className="px-4 py-3 font-medium">Contact Info</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{customer.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3" /> {customer.address}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" /> {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" /> {customer.contact}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openEditModal(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
