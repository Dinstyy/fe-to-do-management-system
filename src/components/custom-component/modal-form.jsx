"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ModalForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    deadline: null,
    status: "",
    create_by: "",
    update_by: "",
  });

  function handleInputChanges(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSelectChange(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

   async function handleSubmit() {
    try {
        const response = await fetch('http://localhost:8080/tasks/create', {
            method: "POST",
            headers: {'Content-Type':"application/json"},
            body: JSON.stringify(formData),
        });

        console.log('r:' . response);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            router.push('/dashboard');
        } else {
            console.error('Request failed:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        // alert('gagal');
    }
}

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"> <Plus />Add Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when youre done.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-left">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              onChange={handleInputChanges}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChanges}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !formData.deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.deadline
                    ? format(formData.deadline, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.deadline}
                  onSelect={(date) => {
                    if (date) {
                      setFormData((prev) => ({
                        ...prev,
                        deadline: date,
                      }));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}